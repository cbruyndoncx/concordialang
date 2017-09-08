import { NodeBasedSDA } from './NodeBasedSDA';
import { ScenarioSDA } from './ScenarioSDA';
import { LocatedException } from '../../req/LocatedException';
import { ImportSDA } from './ImportSDA';
import { SemanticException } from '../SemanticException';
import { InputFileExtractor } from '../../util/InputFileExtractor';
import { Import } from '../../ast/Import';
import { Document } from '../../ast/Document';
import { SemanticAnalysisContext } from '../SemanticAnalysisContext';

/**
 * Single-document Semantic Analyzer
 * 
 * @author Thiago Delgado Pinto
 */
export class SingleDocumentAnalyzer {

    private _nodeAnalyzers: NodeBasedSDA[];

    constructor() {
        this._nodeAnalyzers = [
            new ImportSDA(),
            new ScenarioSDA()
        ];
    }

    public analyze( doc: Document, errors: LocatedException[] ) {
        for ( let analyzer of this._nodeAnalyzers ) {
            analyzer.analyze( doc, errors );
        }
    }

}