import { basename } from 'path';
import { EntityValueType, Step, UIElement, UIPropertyReference, UIPropertyTypes } from "../ast";
import { RuntimeException } from '../error/RuntimeException';
import { Symbols } from '../req/Symbols';
import { isDefined, UIElementNameHandler } from "../util";
import { removeDuplicated } from '../util/remove-duplicated';
import { GenContext } from "./PreTestCaseGenerator";
import { formatValueToUseInASentence } from './value-formatter';

/**
 * Replaces UIE property references.
 *
 * @author Thiago Delgado Pinto
 */
export class UIPropertyReferenceReplacer {

    /**
     * Returns the content with all the UIProperty references replaced by their value.
     *
     * @param step Input step.
     * @param content Input content.
     * @param uiePropertyReferences References to replace.
     * @param uieVariableToValueMap Map that contains the value of all UIElement variables.
     * @param ctx Generation context.
     * @param isAlreadyInsideAString Indicates if the value is already inside a string. Optional, defaults to `false`.
     */
    replaceUIPropertyReferencesByTheirValue(
        language: string,
        step: Step,
        content: string,
        uiePropertyReferences: UIPropertyReference[],
        uieVariableToValueMap: Map< string, EntityValueType >,
        ctx: GenContext,
        isAlreadyInsideAString: boolean = false
    ): string {

        const uieNameHandler = new UIElementNameHandler();
        let newContent = content;

        for ( let uipRef of uiePropertyReferences || [] ) {

            // Properties different from VALUE are not supported yet
            if ( uipRef.property != UIPropertyTypes.VALUE ) {
                const fileName = basename( ctx.doc.fileInfo.path );
                const locStr = '(' + step.location.line + ',' + step.location.column + ')';
                const msg = 'Could not retrieve a value from ' +
                    Symbols.UI_ELEMENT_PREFIX + uipRef.uiElementName +
                    Symbols.UI_PROPERTY_REF_SEPARATOR + uipRef.property + Symbols.UI_ELEMENT_SUFFIX +
                    ' in ' + fileName + ' ' + locStr + '. Not supported yet.';
                const err = new RuntimeException( msg );
                ctx.warnings.push( err );
                continue;
            }

            const uieName = uipRef.uiElementName;
            const [ featureName, /* uieNameWithoutFeature */ ] = uieNameHandler.extractNamesOf( uieName );
            let variable: string;
            let uie: UIElement;

            if ( isDefined( featureName ) ) {
                variable = uieName;
                uie = ctx.spec.uiElementByVariable( uieName );
            } else {
                uie = ctx.spec.uiElementByVariable( uieName, ctx.doc );
                variable = ! uie ? uieName : ( ! uie.info ? uieName : uie.info.fullVariableName );
            }
            // variable is in the format Feature:UIElement

            let value: EntityValueType = uieVariableToValueMap.get( variable );
            if ( ! isDefined( value ) ) {
                const fileName = ctx.doc.fileInfo ? basename( ctx.doc.fileInfo.path ) : 'unknown file';
                const locStr = '(' + step.location.line + ',' + step.location.column + ')';
                const msg = 'Could not retrieve a value from ' +
                    Symbols.UI_ELEMENT_PREFIX + variable + Symbols.UI_ELEMENT_SUFFIX +
                    ' in ' + fileName + ' ' + locStr + '. It will receive an empty value.';
                const err = new RuntimeException( msg );
                ctx.warnings.push( err );
                value = '';
            }

            const formattedValue = formatValueToUseInASentence(
                language, value, isAlreadyInsideAString );

            const refStr: string = Symbols.UI_ELEMENT_PREFIX + uipRef.content + Symbols.UI_ELEMENT_SUFFIX;
            newContent = newContent.replace( refStr, formattedValue );
        }

        removeDuplicated( ctx.warnings, ( a, b ) => a.message == b.message );

        return newContent;
    }

}