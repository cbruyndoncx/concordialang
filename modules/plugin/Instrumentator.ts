import { Location  } from "../ast/Location";
import { RuntimeException } from '../req/RuntimeException';
import { Warning } from '../req/Warning';
import * as readline from 'readline';
import * as fs from 'fs';

/**
 * Specification instrumentator interface.
 * 
 * @author Thiago Delgado Pinto
 */
export interface Instrumentator {

    generateForSpecFile( specFile: string ): string;
    generateForSpecLineNumber( lineNumber: number ): string;

    retrieveSpecFile( line: string ): string | null;
    retrieveSpecLineNumber( line: string ): number | null;
}

/**
 * Default specification instrumentator that works with double-slashed line comments.
 * 
 * Keywords used:
 * - spec: references a specification file, e.g. "// spec: path/to/file.feature"
 * - line: references a specification line number, e.g., "// line: 10"
 * 
 * @author Thiago Delgado Pinto
 */
export class DefaultInstrumentator implements Instrumentator {

    public generateForSpecFile( specFile: string ): string {
        return '// spec: ' + specFile;
    }

    public generateForSpecLineNumber( lineNumber: number ): string {
        return '// line: ' + lineNumber;
    }

    public retrieveSpecFile( instrumentedLine: string ): string | null {
        const regex = /\/\/(?: )*spec(?: )*:(.+)/gui;
        const r = regex.exec( instrumentedLine );
        return ( r && r[ 1 ] ) ? r[ 1 ].trim() : null;
    }

    public retrieveSpecLineNumber( instrumentedLine: string ): number | null {
        const regex = /\/\/(?: )*line(?: )*:(?: )*([0-9]+)/gui;
        const r = regex.exec( instrumentedLine );
        return ( r && r[ 1 ] ) ? parseInt( r[ 1 ] ) : null;
    }

}


 /**
  * Default script file instrumentation.
  * 
  * @author Thiago Delgado Pinto
  */
export class FileInstrumentator {

    constructor(
        private _instrumentator: Instrumentator = new DefaultInstrumentator(),
        private _fs: any = fs,
        private _encoding: string = 'utf-8'
    ) {
    }

    /**
     * Retrieves specification location from a script file location.
     * 
     * @param scriptFilePath Script file path.
     * @param scriptLineNumber Script line number.
     */
    public async retrieveSpecLocation( scriptLoc: Location ): Promise< Location > {

        return new Promise< Location >( ( resolve, reject ) => {

            let lineCounter: number = 0;        
            let specFilePath: string = null;
            let specLineNumber: number = 0;
    
            let readStream = this._fs.createReadStream( scriptLoc.filePath );
            readStream.setEncoding( this._encoding );
    
            const rl = readline.createInterface( { input: readStream } as any );

            rl.on( 'error', () => {
                const msg = 'Error reading the file "' + scriptLoc.filePath + '".';
                reject( new RuntimeException( msg, scriptLoc ) );
            } );
    
            rl.on( 'line', ( content ) => {

                ++lineCounter;
    
                // Retrieve the specification file from the first line
                if ( 1 === lineCounter ) {
                    specFilePath = this._instrumentator.retrieveSpecFile( content );
                }
    
                // Retrive the specification column from the code instrumentation,
                // i.e., an annotation with the specification column
                if ( lineCounter === scriptLoc.line ) {
    
                    specLineNumber = this._instrumentator.retrieveSpecLineNumber( content );

                    // No more to do with the file, so close it.
                    rl.close();
                }
    
            } );
    
            rl.on( 'close', () => {

                // Specification info not found, reject it
                if ( null === specFilePath || 0 === specLineNumber ) {
                    const msg = 'Specification information could not be retrieved from "' + scriptLoc.filePath + '".';
                    return reject( new Warning( msg, scriptLoc ) );
                }

                const specLoc: Location = {
                    filePath: specFilePath,
                    line: specLineNumber,
                    column: 1
                };

                resolve( specLoc );
            } );            

        } );

    }
       
}