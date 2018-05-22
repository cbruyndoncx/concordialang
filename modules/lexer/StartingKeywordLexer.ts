import { Warning } from '../req/Warning';
import { Symbols } from '../req/Symbols';
import { Node, ContentNode, HasValue } from '../ast/Node';
import { NodeLexer, LexicalAnalysisResult } from "./NodeLexer";
import { LineChecker } from "../req/LineChecker";
import { Expressions } from "../req/Expressions";
import { KeywordBasedLexer } from "./KeywordBasedLexer";

/**
 * Detects a node in the format "keyword anything".
 *
 * @author Thiago Delgado Pinto
 */
export class StartingKeywordLexer< T extends ContentNode > implements NodeLexer< T >, KeywordBasedLexer {

    private _lineChecker: LineChecker = new LineChecker();

    constructor( private _words: Array< string >, private _nodeType: string ) {
    }

    /** @inheritDoc */
    public nodeType(): string {
        return this._nodeType;
    }

    /** @inheritDoc */
    suggestedNextNodeTypes(): string[] {
        return [];
    }

    /** @inheritDoc */
    public affectedKeyword(): string {
        return this._nodeType;
    }

    /** @inheritDoc */
    public updateWords( words: string[] ) {
        this._words = words;
    }

    protected makeRegexForTheWords( words: string[] ): string {
        return '^' + Expressions.OPTIONAL_SPACES_OR_TABS
            + '(?:' + words.join( '|' ) + ')'
            + Expressions.AT_LEAST_ONE_SPACE_OR_TAB_OR_COMMA
            + '(' + Expressions.ANYTHING + ')';
    }

    /** @inheritDoc */
    public analyze( line: string, lineNumber?: number ): LexicalAnalysisResult< T > {

        let exp = new RegExp( this.makeRegexForTheWords( this._words ), "iu" );
        let result = exp.exec( line );
        if ( ! result ) {
            return null;
        }

        let value = this.removeComment( result[ 1 ].trim() );
        let content = this.removeComment( line.trim() );

        let pos = this._lineChecker.countLeftSpacesAndTabs( line );

        let node = {
            nodeType: this._nodeType,
            location: { line: lineNumber || 0, column: pos + 1 },
            content: content
        } as T;

        if ( 'value' in node ) {
            node[ 'value' ] = value;
        }

        let warnings = [];
        if ( value.length < 1 ) {
            let w = new Warning( 'Value is empty', node.location );
            warnings.push( w );
        }

        return { nodes: [ node ], errors: [], warnings: warnings };
    }


    private removeComment( content: string ): string {
        let commentPos = content.lastIndexOf( Symbols.COMMENT_PREFIX );
        if ( commentPos >= 0 ) {
            // If the preceding character is '<', it is not a comment
            if ( commentPos > 1 && content.substr( commentPos - 1, 1 ) === Symbols.UI_LITERAL_PREFIX ) {
                return content;
            }
            return content.substring( 0, commentPos ).trim();
        }
        return content;
    }

}