import * as fs from 'fs';
import { dirname, join } from 'path';

import { Import, Document } from '../../ast';
import { DuplicationChecker } from '../../util/DuplicationChecker';
import { SemanticException } from "../SemanticException";
import { DocumentAnalyzer } from './DocumentAnalyzer';

/**
 * Import analyzer for a single document.
 *
 * Checkings:
 *  - Duplicated imports
 *  - Self references
 *  - Files existence
 *
 * @author Thiago Delgado Pinto
 */
export class ImportDA implements DocumentAnalyzer {

    constructor(
        private _fs: any = fs
    ) {
    }

    /** @inheritDoc */
    public analyze( doc: Document, errors: SemanticException[] ) {

        // Checking the document
        if ( ! doc.imports ) {
            doc.imports = [];
            return;
        }

        // Check duplicated imports
        let duplicated: Import[] = ( new DuplicationChecker() )
            .withDuplicatedProperty( doc.imports, 'content' );
        for ( let dup of duplicated ) {
            let msg = 'Duplicated imported to file "' + dup.value + '".';
            let err = new SemanticException( msg, dup.location );
            errors.push( err );
        }


        for ( let imp of doc.imports ) {

            let importPath = imp.value;
            let resolvedPath = join( dirname( doc.fileInfo.path ), importPath );

            // Add the resolved path to the import
            imp.resolvedPath = resolvedPath;

            // Check for a self reference
            if ( doc.fileInfo.path === resolvedPath ) {
                let msg = 'Imported file is a self reference: "' + importPath + '".';
                let err = new SemanticException( msg, imp.location );
                errors.push( err );
            }

            // Check if the imported file exist
            const exists: boolean = this._fs.existsSync( resolvedPath );
            if ( ! exists ) {
                let msg = 'Imported file not found: "' + importPath + '".';
                let err = new SemanticException( msg, imp.location );
                errors.push( err );
            }
        }
    }

}