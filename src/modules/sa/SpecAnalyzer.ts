import { ImportSpecAnalyzer } from './ImportSpecAnalyzer';
import { NodeBasedSpecAnalyzer } from './NodeBasedSpecAnalyzer';
import { Spec } from "../ast/Spec";
import { LocatedException } from "../req/LocatedException";

/**
 * Specification semantic analyzer.
 * 
 * @author Thiago Delgado Pinto
 */

export class SpecAnalyzer {

    private _analyzers: NodeBasedSpecAnalyzer[];

    constructor() {
        this._analyzers = [
            new ImportSpecAnalyzer()
        ];
    }

    public analyze( spec: Spec, errors: LocatedException[] ) {
        for ( let an of this._analyzers ) {
            an.analyze( spec, errors );
        }
    }

}