import { EnglishKeywordDictionary } from '../../modules/dict/EnglishKeywordDictionary';
import { InMemoryKeywordDictionaryLoader } from '../../modules/dict/InMemoryKeywordDictionaryLoader';
import { KeywordDictionaryLoader } from '../../modules/dict/KeywordDictionaryLoader';
import { Lexer } from "../../modules/lexer/Lexer";
import { KeywordDictionary } from "../../modules/dict/KeywordDictionary";
import { TokenTypes } from "../../modules/req/TokenTypes";

/**
 * @author Thiago Delgado Pinto
 */
describe( 'LexerTest', () => {

    const enDictionary: KeywordDictionary = new EnglishKeywordDictionary();

    const ptDictionary: KeywordDictionary = {
        // Not available in Gherkin
        import: [ 'importe' ],
        regexBlock: [ 'expressões regulares' ],
        state: [ 'estado' ],
        testcase: [ 'caso de teste' ],

        // Also available in Gherkin

        language: [ 'language', 'idioma', 'língua' ],

        feature: [ 'funcionalidade', 'característica' ],
        scenario: [ 'cenário' ],

        stepGiven: [ 'dado' ],
        stepWhen: [ 'quando' ],
        stepThen: [ 'então' ],
        stepAnd: [ 'e', 'mas' ]
    };    

    let loader: KeywordDictionaryLoader = new InMemoryKeywordDictionaryLoader(
        {
            'en': enDictionary,
            'pt': ptDictionary
        }
    );

    let lexer: Lexer = new Lexer( 'en', loader ); // under test

    // Helper function
    function assertLineExpectations( lines: any[] ) {
        lines.forEach( ( val, index ) => lexer.addNodeFromLine( val.l, index + 1 ) );
        
        expect( lexer.errors().length ).toBe( 0 );

        let expectations = lines
            .filter( val => val.e !== null ) // only the defined expectations
            .map( val => val.e ); // return the expectations

        lexer.nodes().forEach( ( node, index ) =>
            expect( node.keyword ).toBe( expectations[ index ] ) ); // same index as the expectation
    }


    beforeEach( () => {
        lexer.reset();
    } );

    it( 'ignores empty lines', () => {
        expect( lexer.addNodeFromLine( '', 1 ) ).toBeFalsy();
    } );

    it( 'detects correctly in english', () => {
        let lines = 
        [
            { l: '#language:en', e: TokenTypes.LANGUAGE },
            { l: '', e: null },
            { l: 'import "somefile"', e: TokenTypes.IMPORT },
            { l: '', e: null },
            { l: '@important', e: TokenTypes.TAG },
            { l: 'feature: my feature', e: TokenTypes.FEATURE },
            { l: ' \t', e: null },
            { l: 'scenario: hello', e: TokenTypes.SCENARIO },
            { l: '  given something', e: TokenTypes.STEP_GIVEN },
            { l: '    and another thing', e: TokenTypes.STEP_AND },
            { l: '  when anything happens', e: TokenTypes.STEP_WHEN },
            { l: '    and other thing happens', e: TokenTypes.STEP_AND },
            { l: '    but other thing does not happen', e: TokenTypes.STEP_AND },
            { l: '  then the result is anything', e: TokenTypes.STEP_THEN },
            { l: '    and another result could also happen', e: TokenTypes.STEP_AND },
            { l: '', e: null },
            { l: 'Test Case: my test case', e: TokenTypes.TEST_CASE },
            { l: '  Given that I see the url "/login"', e: TokenTypes.STEP_GIVEN },
            { l: '  When I fill "#username" with ""', e: TokenTypes.STEP_WHEN },
            { l: '    And I fill "#password" with "bobp4ss"', e: TokenTypes.STEP_AND },
            { l: '    And I click "Enter"', e: TokenTypes.STEP_AND },
            { l: '', e: null },
            { l: 'Regular Expressions:', e: TokenTypes.REGEX_BLOCK },
            { l: '', e: null },
            { l: 'this must be recognized as text', e: TokenTypes.TEXT }
        ];

        assertLineExpectations( lines );
    } );


    it( 'detects correctly in portuguese', () => {
        let lines = 
        [
            { l: '#language:pt', e: TokenTypes.LANGUAGE },
            { l: '', e: null },
            { l: 'importe "somefile"', e: TokenTypes.IMPORT },
            { l: '', e: null },
            { l: '@importante', e: TokenTypes.TAG },
            { l: 'característica: my feature', e: TokenTypes.FEATURE },
            { l: ' \t', e: null },
            { l: 'cenário: hello', e: TokenTypes.SCENARIO },
            { l: '  dado something', e: TokenTypes.STEP_GIVEN },
            { l: '    e another thing', e: TokenTypes.STEP_AND },
            { l: '  quando anything happens', e: TokenTypes.STEP_WHEN },
            { l: '    e other thing happens', e: TokenTypes.STEP_AND },
            { l: '    mas other thing does not happen', e: TokenTypes.STEP_AND },
            { l: '  então the result is anything', e: TokenTypes.STEP_THEN },
            { l: '    e another result could also happen', e: TokenTypes.STEP_AND },
            { l: '', e: null },
            { l: 'Caso de Teste: my test case', e: TokenTypes.TEST_CASE },
            { l: '  Dado que vejo a url "/login"', e: TokenTypes.STEP_GIVEN },
            { l: '  Quando preencho "#username" com ""', e: TokenTypes.STEP_WHEN },
            { l: '  E preencho "#password" com "bobp4ss"', e: TokenTypes.STEP_AND },
            { l: '  E clico "Enter"', e: TokenTypes.STEP_AND },
            { l: '', e: null },
            { l: 'Expressões Regulares:', e: TokenTypes.REGEX_BLOCK },
            { l: '', e: null },
            { l: 'isso must be recognized as text', e: TokenTypes.TEXT }
        ];

        assertLineExpectations( lines );
    } );

} );