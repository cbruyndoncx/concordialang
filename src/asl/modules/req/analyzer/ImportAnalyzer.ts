import { Import } from '../ast/Import';
import { NodeAnalyzer } from './NodeAnalyzer';
import { Feature } from '../ast/Feature';
import { Document } from '../ast/Document';
import { Spec } from '../ast/Spec';
import { LocatedException } from "../LocatedException";
import { SemanticException } from './SemanticException';

export class ImportAnalyzer implements NodeAnalyzer< Import > {

    /** @inheritDoc */
    public analyzeInDocument(
        current: Import,
        doc: Document,
        errors: Array< LocatedException >,
        stopOnTheFirstError: boolean
    ): void {
        // Detect repeated imports
        if ( doc.imports.includes( current ) ) {
            let e =  new SemanticException( 'Repeated import for file "' + current.content + '".',
                current.location );
            errors.push( e );
        }
    }

    /** @inheritDoc */
    public analyzeInSpec(
        current: Import,
        spec: Spec,
        errors: Array< LocatedException >,
        stopOnTheFirstError: boolean
    ): void {
        // TO-DO: analyze if the imported file exists
        // TO-DO: analyze cycles
    }    

}