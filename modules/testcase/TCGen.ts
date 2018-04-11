import { Variant, TestCase } from "../ast/Variant";
import { TestScenario } from "../testscenario/TestScenario";
import { Step } from "../ast/Step";
import { NLPUtil, NLPEntity } from "../nlp/NLPResult";
import { Entities } from "../nlp/Entities";
import { KeywordDictionary } from "../dict/KeywordDictionary";
import { NodeTypes } from "../req/NodeTypes";
import { LanguageContent } from "../dict/LanguageContent";
import { Symbols } from "../req/Symbols";
import { RandomString } from "../testdata/random/RandomString";
import { Random } from "../testdata/random/Random";
import { Location } from "../ast/Location";
import { upperFirst } from "../util/CaseConversor";
import { Spec } from "../ast/Spec";
import { EntityValueType, UIElement } from "../ast/UIElement";
import { Document } from "../ast/Document";
import { LocatedException } from "../req/LocatedException";
import { RuntimeException } from "../req/RuntimeException";
import { isNumber } from "../util/TypeChecking";
import { UIElementPropertyExtractor } from "../util/UIElementPropertyExtractor";
import { CaseType } from "../app/CaseType";
import { DataTestCaseAnalyzer, DTCAnalysisResult } from "../testdata/DataTestCaseAnalyzer";
import { DataGenerator, DataGenConfig } from "../testdata/DataGenerator";
import { DataGeneratorBuilder } from "../testdata/DataGeneratorBuilder";
import { DataTestCase } from "../testdata/DataTestCase";
import { RandomLong } from "../testdata/random/RandomLong";
import { UIPropertyTypes } from "../util/UIPropertyTypes";

export class TCGen {

    private readonly _nlpUtil = new NLPUtil();
    private readonly _randomString: RandomString;
    private readonly _randomLong: RandomLong;
    private readonly _uiePropExtractor = new UIElementPropertyExtractor();
    private readonly _dtcAnalyzer: DataTestCaseAnalyzer;
    private readonly _dataGen: DataGenerator;

    public validKeyword: string = 'valid';
    public randomKeyword: string = 'random';

    constructor(
        // private _variantToTestCaseMap: Map< Variant, TestCase[] >
        public readonly seed: string,
        public readonly uiLiteralCaseOption: CaseType = CaseType.CAMEL,
        public readonly minRandomStringSize = 0,
        public readonly maxRandomStringSize = 100,
        public readonly randomTriesToInvalidValues = 5
    ) {
        const random = new Random( seed );
        this._randomString = new RandomString( random );
        this._randomLong = new RandomLong( random );
        this._dtcAnalyzer = new DataTestCaseAnalyzer( seed );
        this._dataGen = new DataGenerator( new DataGeneratorBuilder( seed, randomTriesToInvalidValues ) );
    }

    generate(
        variant: Variant,
        testScenarios: TestScenario[]
    ): TestCase[] {
        let testCases: TestCase[] = [];

        //
        // Test Cases are formed according to the UI Elements and applicable Data Test Cases.
        //
        // Steps with the "external" flag set - referred here as "external step" - indicate
        // that a valid value should be generated for it. So if an external step has a UI Element
        // reference, there is a need to generate a valid value. Thus, such steps from any
        // Test Scenario must be changed.
        //
        // Non external steps that have references to UI Elements must receive test data
        // according to the applicable Data Test Case. Since there may be an explosion of
        // combinations, a combination strategy is needed (ex.: defaults to 1-wise).
        //

        // Question: gerar valores para UI Elements de Variants externas ao gerar o cenário de teste?

        return testCases;
    }


    /**
     * Fill UI Literals without value with a random value. It generates one step for every UI Literal
     * or UI Element found. Only UI Literals receive value.
     *
     * @param step Step to analyze
     * @param keywords Keywords dictionary
     */
    fillEventualUILiteralsWithoutValueWithRandomValue( step: Step, keywords: KeywordDictionary ): Step[] {

        const fillEntity = this.extractFillEntity( step );

        if ( null === fillEntity || this.hasValue( step ) || this.hasNumber( step ) ) {
            return [ step ];
        }

        let uiLiterals = this._nlpUtil.entitiesNamed( Entities.UI_LITERAL, step.nlpResult );
        const uiLiteralsCount = uiLiterals.length;
        if ( uiLiteralsCount < 1 ) {
            return [ step ]; // nothing to do
        }

        let uiElements = this._nlpUtil.entitiesNamed( Entities.UI_ELEMENT, step.nlpResult );

        // Create a step with 'fill' step for every UI_LITERAL

        const prefixAnd = upperFirst( keywords.stepAnd[ 0 ] || 'And' );
        let prefix = this.prefixFor( step, keywords );
        const keywordI = keywords.i[ 0 ] || 'I';
        const keywordWith = keywords.with[ 0 ] || 'with';

        let steps: Step[] = [];
        let line = step.location.line, count = 0;

        let entities: NLPEntity[] = [];
        if ( uiElements.length > 0 ) {
            entities.push.apply( entities, uiLiterals );
            entities.push.apply( entities, uiElements );
            entities.sort( ( a, b ) => a.position - b.position ); // sort by position
        } else {
            entities = uiLiterals;
        }

        for ( let entity of entities ) {

            // Change to "AND" when more than one UI Literal is available
            if ( count > 0 ) {
                prefix = prefixAnd;
            }

            let sentence = prefix + ' ' + keywordI + ' ' + fillEntity.string + ' ';
            if ( Entities.UI_LITERAL === entity.entity ) {
                sentence += Symbols.UI_LITERAL_PREFIX + entity.string + Symbols.UI_LITERAL_SUFFIX +
                    ' ' + keywordWith + ' ' +
                    Symbols.VALUE_WRAPPER + this.randomString() + Symbols.VALUE_WRAPPER;

                // Add comment
                sentence += ' ' + Symbols.COMMENT_PREFIX + ' ' + this.validKeyword + Symbols.TITLE_SEPARATOR + ' ' + this.randomKeyword;
            } else {
                sentence += entity.string; // UI Element currently doesn't need prefix/sufix
            }

            let newStep = {
                content: sentence,
                type: step.nodeType,
                location: {
                    column: step.location.column,
                    line: line++,
                    filePath: step.location.filePath
                } as Location
            } as Step;

            steps.push( newStep );

            ++count;
        }

        return steps;
    }



    /**
     * Transforms an external step that contains a fill action and one or more
     * UIElements into one or more steps (one for every UI Element) with valid
     * values.
     *
     * @param step
     * @param keywords
     * @param spec Specification for extracting data about uiElements
     * @param externalUIElementVarToValueMap Data of external UI Elements
     * @param externalStepCache External step cache
     */
    async transformExternalStepThatFillsUIElementsWithoutValueIntoUILiteralWithValidValue(
        step: Step,
        keywords: KeywordDictionary,
        spec: Spec,
        doc: Document,
        externalUIElementVarToValueMap: Map< string, EntityValueType >,
        externalStepCache: Map< string, Step[] >,
        errors: LocatedException[]
    ): Promise< Step[] > {

        // No external ? -> do nothing
        if ( step.external !== true ) {
            return [ step ];
        }

        const fillEntity = this.extractFillEntity( step );
        if ( null === fillEntity || this.hasValue( step ) || this.hasNumber( step ) ) {
            return [ step ];
        }

        // Same step in cache?
        let steps = externalStepCache.get( step.content ) || null;
        if ( steps !== null ) {
            return steps;
        }

        const prefixAnd = upperFirst( keywords.stepAnd[ 0 ] || 'And' );
        let prefix = this.prefixFor( step, keywords );
        const keywordI = keywords.i[ 0 ] || 'I';
        const keywordWith = keywords.with[ 0 ] || 'with';

        steps = [];
        let uiElements = this._nlpUtil.entitiesNamed( Entities.UI_ELEMENT, step.nlpResult );
        let line = step.location.line, count = 0;

        for ( let entity of uiElements ) {

            let value = externalUIElementVarToValueMap.get( entity.value ) || null;
            let uie: UIElement | null = spec.uiElementByVariable( entity.value, doc );
            if ( null === value ) {
                if ( null === uie ) {
                    value = this.randomString();
                    const msg = 'Could not retrieve UI Element "' + entity.value + '" to generate value. A random value was generated.';
                    errors.push( new RuntimeException( msg, step.location ) );
                } else {
                    value = await this.generateValidValue( uie, errors );
                }
                // Add value to map
                externalUIElementVarToValueMap.set( entity.value, value );
            }


            // Change to "AND" when more than one UI Literal is available
            if ( count > 0 ) {
                prefix = prefixAnd;
            }

            let uiLiteral = uie && uie.info ? uie.info.uiLiteral : this.makeUiLiteral( uie );

            let sentence = prefix + ' ' + keywordI + ' ' + fillEntity.string + ' ' +
                Symbols.UI_LITERAL_PREFIX + uiLiteral + Symbols.UI_LITERAL_SUFFIX +
                ' ' + keywordWith + ' ' +
                isNumber( value ) ? value : Symbols.VALUE_WRAPPER + value + Symbols.VALUE_WRAPPER;

            let newStep = {
                content: sentence,
                type: step.nodeType,
                location: {
                    column: step.location.column,
                    line: line++,
                    filePath: step.location.filePath
                } as Location
            } as Step;

            steps.push( newStep );

            ++count;
        }

        // Add to cache
        externalStepCache.set( step.content, steps );

        return steps;
    }


    extractFillEntity( step: Step ): NLPEntity | null {
        return step.nlpResult.entities
            .find( e => e.entity === Entities.UI_ACTION && this.isFillAction( e.value ) ) || null;
    }

    isFillAction( action: string ): boolean {
        return 'fill' === action; // TODO: refactor
    }

    hasValue( step: Step ): boolean {
        if ( ! step || ! step.nlpResult ) {
            return false;
        }
        return this._nlpUtil.hasEntityNamed( Entities.VALUE, step.nlpResult );
    }

    hasNumber( step: Step ): boolean {
        if ( ! step || ! step.nlpResult ) {
            return false;
        }
        return this._nlpUtil.hasEntityNamed( Entities.NUMBER, step.nlpResult );
    }

    randomString(): string {
        return this._randomString.between( this.minRandomStringSize, this.maxRandomStringSize );
    }


    prefixFor( step: Step, keywords: KeywordDictionary ): string {
        let prefix;
        switch ( step.nodeType ) {
            case NodeTypes.STEP_GIVEN: prefix = keywords.stepGiven[ 0 ] || 'Given that'; break;
            case NodeTypes.STEP_WHEN: prefix = keywords.stepWhen[ 0 ] || 'When'; break;
            case NodeTypes.STEP_THEN: prefix = keywords.stepThen[ 0 ] || 'Then'; break;
            case NodeTypes.STEP_AND: prefix = keywords.stepAnd[ 0 ] || 'And'; break;
            default: prefix = keywords.stepOtherwise[ 0 ] || 'Otherwise'; break;
        }
        return upperFirst( prefix );
    }

    async generateValidValue( uie: UIElement, errors: LocatedException[] ): Promise< EntityValueType > {
        let map = this._dtcAnalyzer.analyzeUIElement( uie, errors );
        let set = new Set();
        for ( let [ dtc, result ] of map ) {
            if ( DTCAnalysisResult.VALID === result ) {
                set.add( dtc );
            }
        }

        const cfg = this.makeDataGenConfigFromUIElement( uie );
        const count = set.size;

        // No applicable test cases?
        if ( count < 1 ) {
            return await this._dataGen.generate( DataTestCase.REQUIRED_FILLED, cfg );
        }

        // Select a random valid test case
        const index = count > 1 ? this._randomLong.between( 0, count - 1 ) : 0;
        return await this._dataGen.generate( set[ index ], cfg );
    }

    makeDataGenConfigFromUIElement( uie: UIElement ): DataGenConfig {
        let cfg: DataGenConfig = new DataGenConfig();

        const propertiesMap = this._uiePropExtractor.mapFirstProperty( uie );

        // Properties
        const pValue = propertiesMap.get( UIPropertyTypes.VALUE ) || null;
        const pMinLength = propertiesMap.get(  UIPropertyTypes.MIN_LENGTH ) || null;
        const pMaxLength = propertiesMap.get( UIPropertyTypes.MAX_LENGTH ) || null;
        const pMinValue = propertiesMap.get( UIPropertyTypes.MIN_VALUE ) || null;
        const pMaxValue = propertiesMap.get( UIPropertyTypes.MAX_VALUE ) || null;
        const pFormat = propertiesMap.get( UIPropertyTypes.FORMAT ) || null;

        // TODO: ...


        return cfg;
    }

    makeUiLiteral( uie: UIElement ): string {
        return this._uiePropExtractor.extractId( uie, this.uiLiteralCaseOption );
    }
}