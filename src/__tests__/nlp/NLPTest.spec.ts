import { NLPTrainingDataConversor } from '../../modules/nlp/NLPTrainingDataConversor';
import { NLPEntityUsageExample, NLPTrainingData } from '../../modules/nlp/NLPTrainingData';
import { NLP } from '../../modules/nlp/NLP';

/**
 * @author Thiago Delgado Pinto
 */
describe( 'NLPTest', () => {

    let nlp: NLP; // under test

    let conversor: NLPTrainingDataConversor = new NLPTrainingDataConversor();
    let translationMap = makeTranslationMap();
    let examples = makeTrainingExamples();
    let data: NLPTrainingData = conversor.convert( translationMap, examples );

    function makeTranslationMap(): any {
        return require( '../../data/nlp/pt.json' );
    }

    function makeTrainingExamples(): NLPEntityUsageExample[] {
        return require( '../../data/training/pt.json' );
    }

    beforeEach( () => {
        nlp = new NLP();
    } );

    it( 'starts untrained', () => {
        expect( nlp.isTrained() ).toBeFalsy();
    } );

    it( 'can be trained', () => {
        nlp.train( data );
        expect( nlp.isTrained() ).toBeTruthy();
    } );

    function shouldHaveEntities( results: any[], expectedEntitiesNames: string[] ) {
        for ( let r of results ) {
            //console.log( r );        
            expect( r ).not.toBeFalsy();
            expect( r.intent ).toEqual( "testcase" );
            expect( r.entities ).toHaveLength( expectedEntitiesNames.length );
            let entities = r.entities.map( e => e.entity );
            expect( entities ).toEqual( expectedEntitiesNames );
        }
    }

    it( 'pt - recognizes a click with a value', () => {
        nlp.train( data );
        let results = [];
        results.push( nlp.recognize( 'eu clico em "x"' ) );
        results.push( nlp.recognize( 'eu clico na opção "x"' ) );
        shouldHaveEntities( results, [ "ui_action", "value" ] );
    } );

    it( 'pt - recognizes a click with a target and a value', () => {
        nlp.train( data );
        let results = [];
        results.push( nlp.recognize( 'eu clico no botão "x"' ) );
        shouldHaveEntities( results, [ "ui_action", "ui_target_type", "value" ] );
    } );    

} );