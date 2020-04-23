import * as chalk from 'chalk';
import { TestScriptExecutionResult } from 'concordialang-plugin';
import * as figures from 'figures';
import * as logSymbols from 'log-symbols';
import { basename, relative } from 'path';
import * as readline from 'readline';
import { sprintf } from 'sprintf-js';
import * as terminalLink from 'terminal-link';
import { Defaults } from '../app/Defaults';
import { Options } from '../app/Options';
import { UI } from '../app/UI';
import { sortErrorsByLocation } from '../error/ErrorSorting';
import { LocatedException } from '../error/LocatedException';
import { ProblemMapper } from '../error/ProblemMapper';
import { Warning } from '../error/Warning';
import { PluginData } from '../plugin/PluginData';
import { millisToString } from "../util/TimeFormat";


export const pluralS = ( count: number, singular: string, plural?: string ) => {
    return 1 === count ? singular : ( plural || ( singular + 's' ) );
};


export class SimpleUI implements UI {

    // Ora has a bug that swallows lines before stop that spinner and that's why it was removed.
    // @see https://github.com/sindresorhus/ora/issues/90
    // Note: Same problem using "elegant-spinner" with "log-update"
    //
    // protected _spinner = ora();

    constructor(
        protected readonly _meow: any,
        protected _debugMode: boolean = false
        ) {
    }

    // CLI ---------------------------------------------------------------------

    // SYMBOLS

    readonly symbolPointer = figures.pointerSmall;
    readonly symbolItem = figures.line;

    readonly symbolSuccess = logSymbols.success;
    readonly symbolError = logSymbols.error;
    readonly symbolWarning = logSymbols.warning;
    readonly symbolInfo = logSymbols.info;

    // COLORS

    readonly colorSuccess = chalk.greenBright.bind( chalk ); // chalk.rgb(0, 255, 0);
    readonly colorError = chalk.redBright.bind( chalk ); // chalk.rgb(255, 0, 0);
    readonly colorWarning = chalk.yellow.bind( chalk );
    readonly colorDiscreet = chalk.gray.bind( chalk );
    readonly highlight = chalk.yellowBright.bind( chalk ); // chalk.rgb(255, 242, 0);
    readonly colorText = chalk.white.bind( chalk );
    readonly colorCyanBright = chalk.cyanBright.bind( chalk );
    readonly colorMagenta = chalk.magentaBright.bind( chalk );

    readonly bgSuccess = chalk.bgGreenBright.bind( chalk );
    readonly bgError = chalk.bgRed.bind( chalk );
    readonly bgCriticalError = chalk.bgRgb( 139, 0, 0 ).bind( chalk ); // dark red
    readonly bgWarning = chalk.bgYellow.bind( chalk );
    readonly bgInfo = chalk.bgBlackBright.bind( chalk ); // bgGray does not exist in chalk
    readonly bgHighlight = chalk.bgYellowBright.bind( chalk );
    readonly bgText = chalk.bgWhiteBright.bind( chalk );
    readonly bgCyan = chalk.bgCyan.bind( chalk );

    // protected intervalFn = null;

    // protected startSpinner(): void {
    //     // Ora has a bug that swallows lines before stop that spinner and that's why it was removed.
    //     // @see https://github.com/sindresorhus/ora/issues/90
    //     // Note: Same problem using "elegant-spinner" with "log-update"
    //     //
    //     // this._spinner.start();
    // }

    // protected stopSpinner( symbolWhenStop?: string ): void {
    //     // Ora has a bug that swallows lines before stop that spinner and that's why it was removed.
    //     // @see https://github.com/sindresorhus/ora/issues/90
    //     // Note: Same problem using "elegant-spinner" with "log-update"
    //     //

    //     // const symbol = symbolWhenStop || this.colorInfo( this.symbolInfo );
    //     // this._spinner.stopAndPersist( { symbol: symbol } );

    //     // this._spinner.stop();
    // }

    protected clearLine() {
        readline.cursorTo( process.stdout, 0 );
        readline.clearLine( process.stdout, 0 );
    }

    protected write( ...args ) {
        process.stdout.write( args.join( ' ' ) );
    }

    protected writeln( ... args ) {
        // console.log( ... args ); // weird, swallowing some lines sometimes...
        process.stdout.write( args.join( ' ' ) + '\n' );
    }

    protected properColor( hasErrors: boolean, hasWarnings: boolean ): any {
        if ( hasErrors ) {
            return this.colorError;
        }
        if ( hasWarnings ) {
            return this.colorWarning;
        }
        return this.colorSuccess;
    }

    protected properBg( hasErrors: boolean, hasWarnings: boolean ): any {
        if ( hasErrors ) {
            return this.bgError;
        }
        if ( hasWarnings ) {
            return this.bgWarning;
        }
        return this.bgSuccess;
    }

    protected properSymbol( hasErrors: boolean, hasWarnings: boolean ): any {
        if ( hasErrors ) {
            return this.symbolError;
        }
        if ( hasWarnings ) {
            return this.symbolWarning;
        }
        return this.symbolSuccess;
    }

    // -------------------------------------------------------------------------

    //
    // AppUI
    //

    /** @inheritdoc */
    setDebugMode( debugMode: boolean ): void {
        this._debugMode = debugMode;
    }

    /** @inheritdoc */
    showHelp(): void {
        this.writeln( this._meow.help );
    }

    /** @inheritdoc */
    showAbout(): void {
        const m = this._meow;

        const desc = m.pkg.description || 'Concordia';
        const version = m.pkg.version || '1.0.0';
        const name = m.pkg.author.name || 'Thiago Delgado Pinto';
        const site = m.pkg.homepage || 'http://concordialang.org';

        this.writeln( desc + ' v' + version  );
        this.writeln( 'Copyright (c) ' + name );
        this.writeln( site );
    }

    /** @inheritdoc */
    showVersion(): void {
        this._meow.showVersion();
    }

    /** @inheritdoc */
    announceOptions( options: Options ): void {
        // Language
        if ( new Defaults().LANGUAGE !== options.language ) {
            this.info( 'Default language is', this.highlight( options.language ) );
        }
    }


    /** @inheritdoc */
    announceUpdateAvailable( url: string, hasBreakingChange: boolean ): void {

        // When the terminal does not support links
        const fallback = ( text: string, url: string ): string => {
            return url;
        };

        const link = terminalLink( url, url, { fallback: fallback } ); // clickable URL

        if ( hasBreakingChange ) {
            this.writeln( this.highlight( '→' ), this.bgHighlight( 'PLEASE READ THE RELEASE NOTES BEFORE UPDATING' ) );
            this.writeln( this.highlight( '→' ), link );
        } else {
            this.writeln( this.highlight( '→' ), 'See', link, 'for details.' );
        }
    }

    /** @inheritdoc */
    announceNoUpdateAvailable(): void {
        this.info( 'No updates available.' );
    }

    /** @inheritdoc */
    announceConfigurationFileAlreadyExists(): void {
        this.warn( 'You already have a configuration file.' );
    }

    /** @inheritDoc */
    announcePluginNotFound( pluginDir: string, pluginName: string ): void {
        this.error( `Plugin "${pluginName}" not found at "${pluginDir}".` );
    }

    /** @inheritDoc */
    announcePluginCouldNotBeLoaded( pluginName: string ): void {
        this.error( `Could not load the plugin: ${pluginName}.` );
    }

    /** @inheritDoc */
    announceNoPluginWasDefined(): void {
        this.warn( 'A plugin was not defined.' );
    }

    /** @inheritDoc */
    announceReportFileNotFound( filePath: string ): void {
        this.warn( `Could not retrieve execution results from "${filePath}".` );
    }

    /** @inheritdoc */
    drawLanguages( languages: string[] ): void {
        const highlight = this.highlight;
        this.info(
            'Available languages:',
            languages.sort().map( l => highlight( l ) ).join( ', ' )
        );
    }

    /** @inheritdoc */
    showErrorSavingAbstractSyntaxTree( astFile: string, errorMessage: string ): void {
        this.error( 'Error saving', this.highlight( astFile ), ': ' + errorMessage );
    }

    /** @inheritdoc */
    announceAbstractSyntaxTreeIsSaved( astFile: string ): void {
        this.info( 'Saved', this.highlight( astFile ) );
    }

    /** @inheritdoc */
    showGeneratedTestScriptFiles( scriptDir: string, files: string[], durationMS: number ): void {

        const fileCount = files.length;
        const fileStr = pluralS( fileCount, 'file' );

        this.info(
            this.highlight( fileCount ),
            'test script ' + fileStr, 'generated',
            this.formatDuration( durationMS )
            );
    }

    /** @inheritdoc */
    showTestScriptGenerationErrors( errors: Error[] ): void {
        for ( const err of errors ) {
            this.showException( err );
        }
    }

    /** @inheritdoc */
    success( ...args: any[] ): void {
        this.writeln( this.symbolSuccess, ...args );
    }

    /** @inheritdoc */
    info( ...args: any[] ): void {
        this.writeln( this.symbolInfo, ...args );
    }

    /** @inheritdoc */
    warn( ...args: any[] ): void {
        this.writeln( this.symbolWarning, ...args );
    }

    /** @inheritdoc */
    error( ...args: any[] ): void {
        this.writeln( this.symbolError, ...args );
    }

    /** @inheritdoc */
    showException( error: Error ): void {
        if ( this._debugMode ) {
            this.error( error.message, this.formattedStackOf( error ) );
        } else {
            this.error( error.message );
        }
    }

    // /** @inheritDoc */
    // fileReadError( path: string, error: Error ): void {
    //     this.sameLine( this.symbolError, 'Error reading', path, ': ', error.message );
    // }


    // /** @inheritDoc */
    // directoryReadStarted( directory: string, targets: string[], targetsAreFiles: boolean ): void {

    //     this.newLine( this.symbolInfo, 'Reading directory',
    //         this.colorHighlight( directory ) );

    //     const sameExtensionsAsTheDefaultOnes: boolean =
    //         JSON.stringify( targets.sort().map( e => e.toLowerCase() ) ) ===
    //         JSON.stringify( ( new Defaults() ).EXTENSIONS.sort() );

    //     if ( ! sameExtensionsAsTheDefaultOnes ) {
    //         this.newLine(
    //             this.symbolInfo,
    //             'Looking for',
    //             ( targets.map( e => this.colorHighlight( e ) ).join( ', ' ) ),
    //             targetsAreFiles ? '...' : 'files...'
    //         );
    //     }
    // }


    // /** @inheritDoc */
    // directoryReadFinished( data: DirectoryReadResult ): void {

    //     if ( data.fileErrorCount > 0 ) {
    //         if ( -1 == data.dirCount ) {
    //             this.newLine(
    //                 this.symbolError,
    //                 this.colorError( 'Cannot read the informed directory.' )
    //             );
    //             return;
    //         } else {
    //             this.newLine(
    //                 this.symbolError,
    //                 this.colorError( 'File read errors:' ),
    //                 data.fileErrorCount
    //             );
    //         }
    //     }

    //     this.newLine( this.symbolInfo,
    //         data.dirCount, 'directories analyzed,',
    //         this.colorHighlight( data.filesCount + ' files found,' ),
    //         prettyBytes( data.filesSize ),
    //         this.formatDuration( data.durationMs )
    //         );
    // }

    //
    // OptionsListener
    //

    /** @inheritDoc */
    announceConfigurationFileSaved( filePath: string ): void {
        this.info( 'Saved', this.highlight( filePath ) );
    }

    /** @inheritDoc */
    announceCouldNotLoadConfigurationFile( errorMessage: string ): void {
        // empty
    }

    /** @inheritDoc */
    announceConfigurationFileLoaded( filePath: string, durationMS: number ): void {
        this.info(
            'Configuration file loaded:',
            this.highlight( this._debugMode ? filePath : basename( filePath ) )
        );
    }

    /** @inheritDoc */
    announceSeed( seed: string, generatedSeed: boolean ): void {
        this.info(
            generatedSeed ? 'Generated seed' : 'Seed',
            this.highlight( seed )
        );
    }

    /** @inheritDoc */
    announceRealSeed( realSeed: string ): void {
        if ( this._debugMode )  {
            this.info( 'Real seed', this.highlight( realSeed ) );
        }
    }

    //
    // FileCompilationListener
    //

    /** @inheritDoc */
    fileStarted( path: string ): void {
        // nothing
    }

    /** @inheritDoc */
    fileFinished( path: string, durationMS: number ): void {
        // nothing
    }

    //
    // TCGenListener
    //

    /** @inheritDoc */
    testCaseGenerationStarted( strategyWarnings: Warning[] ): void {
        // empty
    }

    /** @inheritDoc */
    testCaseProduced( path: string, testCasesCount: number, errors: LocatedException[], warnings: Warning[] ): void {

        const hasErrors = errors.length > 0;
        const hasWarnings = warnings.length > 0;
        const successful = ! hasErrors && ! hasWarnings;

        const color = successful ? this.colorSuccess : this.properColor( hasErrors, hasWarnings );
        const symbol = successful ? this.symbolSuccess : this.properSymbol( hasErrors, hasWarnings );

        this.writeln(
            color( symbol ),
            'Generated', this.highlight( path ),
            'with', this.highlight( testCasesCount ), pluralS( testCasesCount, 'test case' )
            );

        if ( ! hasErrors && ! hasWarnings ) {
            return;
        }

        this.showErrors( [ ...errors, ...warnings ], true );
    }

    /** @inheritDoc */
    testCaseGenerationFinished( filesCount: number, testCasesCount: number, durationMs: number ): void {

        this.info(
            this.highlight( filesCount ), 'test case', pluralS( filesCount, 'file' ), 'generated,',
            this.highlight( testCasesCount ), pluralS( testCasesCount, 'test case' ),
            this.formatDuration( durationMs )
        );
    }

    //
    // CompilerListener
    //

    /** @inheritdoc */
    public announceFileSearchStarted(): void {
        // this.startSpinner();
    }

    /** @inheritdoc */
    public announceFileSearchFinished( durationMS: number, files: string[] ): void {
        // this.stopSpinner();
    }

    /** @inheritDoc */
    public announceCompilerStarted( options: Options ): void {
        // this.startSpinner();
        this.write( this.symbolInfo, 'Compiling...' );
    }

    /** @inheritdoc */
    announceCompilerFinished(
        compiledFilesCount: number,
        featuresCount: number,
        testCasesCount: number,
        durationMS: number
        ): void {
        // this.stopSpinner();

        this.clearLine();

        this.info(
            this.highlight( compiledFilesCount ), pluralS( compiledFilesCount, 'file' ), 'compiled,',
            this.highlight( featuresCount ), pluralS( featuresCount, 'feature' ) + ',',
            this.highlight( testCasesCount ), pluralS( testCasesCount, 'test case' ),
            this.formatDuration( durationMS )
            );
    }

    /** @inheritdoc */
    reportProblems( problems: ProblemMapper, basePath: string ): void {

        // GENERIC
        const genericErrors: LocatedException[] = problems.getGenericErrors();
        const genericWarnings: LocatedException[] = problems.getGenericWarnings();

        this.showErrors( [ ...genericErrors, ...genericWarnings ], false );

        // PER FILE

        // When the terminal does not support links
        const fallback = ( text: string, url: string ): string => {
            return text;
        };

        const nonGeneric = problems.nonGeneric();
        for ( const [ filePath, problemInfo ] of nonGeneric ) {

            const hasErrors = problemInfo.hasErrors();
            const hasWarnings = problemInfo.hasWarnings();
            if ( ! hasErrors && ! hasWarnings ) {
                return;
            }
            const color = this.properColor( hasErrors, hasWarnings );
            const symbol = this.properSymbol( hasErrors, hasWarnings );

            const text = relative( basePath, filePath );
            const link = terminalLink( text, filePath, { fallback: fallback } ); // clickable URL

            this.writeln(
                color( symbol ),
                this.highlight( link )
            );

            this.showErrors( [ ...problemInfo.errors, ...problemInfo.warnings], true );
        }

    }

    //
    // PluginListener
    //

    /** @inheritdoc */
    public drawPluginList( plugins: PluginData[] ): void {
        if ( plugins.length < 1 ) {
            this.info( 'No plugins found. Try to install a plugin with NPM.' );
            return;
        }
        // const highlight = this.colorHighlight;
        // const format = "%-20s %-8s %-22s"; // util.format does not support padding :(
        // this.newLine( highlight( sprintf( format, 'Name', 'Version', 'Description' ) ) );
        // for ( let p of plugins ) {
        //     this.newLine( sprintf( format, p.name, p.version, p.description ) );
        // }

        const highlight = this.highlight;
        const format = "%-15s";
        this.info( highlight( 'Available Plugins:' ) );
        for ( let p of plugins ) {
            this.writeln( ' ' );
            this.writeln( highlight( sprintf( format, '  Name' ) ), p.name );
            this.writeln( highlight( sprintf( format, '  Version' ) ), p.version );
            this.writeln( highlight( sprintf( format, '  Description' ) ), p.description );
        }
    }

    /** @inheritdoc */
    public drawSinglePlugin( p: PluginData ): void {
        const format = "  - %-12s: %s"; // util.format does not support padding :(
        const authors = p.authors.map( ( a, idx ) => 0 === idx ? a : sprintf( '%-17s %s', '', a ) );
        this.info( sprintf( 'Plugin %s', this.highlight( p.name ) ) );
        this.writeln( sprintf( format, 'version', p.version ) );
        this.writeln( sprintf( format, 'description', p.description ) );
        this.writeln( sprintf( format, 'authors', authors.join( '\n' ) ) );
        this.writeln( sprintf( format, 'file', this._debugMode ? p.file : basename( p.file ) ) );
        this.writeln( sprintf( format, 'class', p.class ) );
    }

    /** @inheritdoc */
    public showMessagePluginNotFound( name: string ): void {
        this.error(
            sprintf( 'No plugins installed with the name "%s".', this.highlight( name ) )
            );
    }

    /** @inheritdoc */
    public showMessagePluginAlreadyInstalled( name: string ): void {
        this.info(
            sprintf( 'The plugin %s is already installed.', this.highlight( name ) )
            );
    }

    /** @inheritdoc */
    public showMessageTryingToInstall( name: string, tool: string ): void {
        this.info(
            sprintf( 'Trying to install %s with %s.', this.highlight( name ), tool )
            );
    }

    /** @inheritdoc */
    public showMessageTryingToUninstall( name: string, tool: string ): void {
        this.info(
            sprintf( 'Trying to uninstall %s with %s.', this.highlight( name ), tool )
            );
    }

    /** @inheritdoc */
    public showMessageCouldNoFindInstalledPlugin( name: string ): void {
        this.info(
            sprintf( 'Could not find installed plug-in %s. Please try again.', this.highlight( name ) )
            );
    }

    /** @inheritdoc */
    public showMessagePackageFileNotFound( file: string ): void {
        this.warn(
            sprintf( 'Could not find %s. I will create it for you.', this.highlight( file ) )
            );
    }

    /** @inheritdoc */
    public showPluginServeStart( name: string ): void {
        this.info(
            sprintf( 'Serving %s...', this.highlight( name ) )
            );
    }

    /** @inheritdoc */
    public showCommandStarted( command: string ): void {
        this.writeln( '  Running', this.highlight( command ) );
        this.drawSeparationLine();
    }

    /** @inheritdoc */
    public showCommandFinished(): void {
        this.drawSeparationLine();
    }

    protected drawSeparationLine(): void {
        const separationLine = '  ' + '_'.repeat( 78 );
        this.writeln( this.colorDiscreet( separationLine ) );
    }


    /** @inheritdoc */
    public showCommandCode( code: number, showIfSuccess: boolean = true ): void {
        if ( 0 === code ) {
            if ( showIfSuccess ) {
                this.success( 'Success' );
            }
        } else {
            this.error( 'Error during command execution.' );
        }
    }

    /** @inheritdoc */
    public showError( e: Error ): void {
        this.error( e.message );
    }


    //
    // ScriptExecutionListener
    //

    /** @inheritDoc */
    announceTestScriptExecutionStarted(): void {
        this.info( 'Executing test scripts...' );
        this.drawSeparationLine();
    }

    /** @inheritDoc */
    testScriptExecutionDisabled(): void {
        this.info( 'Script execution disabled.' );
    }

    /** @inheritDoc */
    announceTestScriptExecutionError( error: Error ): void {
        this.showException( error );
    }

    /** @inheritDoc */
    announceTestScriptExecutionFinished(): void {
        this.drawSeparationLine();
    }

    /** @inheritDoc */
    showTestScriptAnalysis( r: TestScriptExecutionResult ): void {

        let t = r.total;
        if ( ! t.tests ) {
            this.info( 'No tests executed.' );
            return;
        }

        this.info( 'Test execution results:', "\n" );

        const passedStr = t.passed ? this.bgSuccess( t.passed + ' passed' ) : '';
        const failedStr = t.failed ? this.bgError( t.failed + ' failed' ) : '';
        const adjustedStr = t.adjusted ? this.bgCyan( t.adjusted + ' adjusted' ) : '';
        const errorStr = t.error ? this.bgCriticalError( t.error + ' with error' ) : '';
        const skippedStr = t.skipped ? t.skipped + ' skipped' : '';
        const totalStr = ( t.tests || '0' ) + ' total';

        this.writeln(
            '  ',
            [ passedStr, adjustedStr, failedStr, errorStr, skippedStr, totalStr ].filter( s => s.length > 0 ).join( ', ' ),
            this.colorDiscreet( 'in ' + millisToString( r.durationMs, null, ' ' ) ),
            "\n"
            );

        if ( 0 == t.failed && 0 == t.error ) {
            return;
        }

        const msgReason   = this.colorDiscreet( '       reason:' );
        const msgScript   = this.colorDiscreet( '       script:' );
        const msgDuration = this.colorDiscreet( '     duration:' );
        const msgTestCase = this.colorDiscreet( '    test case:' );

        for ( let tsr of r.results ) {
            for ( let m of tsr.methods ) {
                let e = m.exception;
                if ( ! e ) {
                    continue;
                }

                let color = this.cliColorForStatus( m.status );
                let sLoc = e.scriptLocation;
                let tcLoc = e.specLocation;

                this.writeln(
                    '  ', this.symbolItem, ' '.repeat( 9 - m.status.length ) + color( m.status + ':' ),
                    this.highlight( tsr.suite ), this.symbolPointer, this.highlight( m.name ),
                    "\n",
                    msgReason, e.message,
                    "\n",
                    msgScript, this.highlight( sLoc.filePath ), '(' + sLoc.line + ',' + sLoc.column + ')',
                    "\n",
                    msgDuration, this.colorDiscreet( m.durationMs + 'ms' ),
                    "\n",
                    msgTestCase, this.colorDiscreet( tcLoc.filePath, '(' + tcLoc.line + ',' + tcLoc.column + ')' ),
                    "\n"
                );
            }
        }
    }

    //
    // OTHER
    //

    protected cliColorForStatus( status: string ): any {
        switch ( status.toLowerCase() ) {
            case 'passed': return this.colorSuccess;
            case 'adjusted': return this.colorCyanBright;
            case 'failed': return this.colorWarning;
            case 'error': return this.colorError;
            default: return this.colorText;
        }
    }

    protected showErrors( errors: LocatedException[], showSpaces: boolean ) {
        if ( ! errors || errors.length < 1 ) {
            return;
        }
        const sortedErrors = sortErrorsByLocation( errors );
        const spaces = ' ';
        for ( let e of sortedErrors ) {

            const symbol = e.isWarning ? this.symbolWarning : this.symbolError;

            let msg = this._debugMode
                ? e.message + ' ' + this.formattedStackOf( e )
                : e.message;
            if ( showSpaces ) {
                this.writeln( spaces, symbol, msg );
            } else {
                this.writeln( symbol, msg );
            }
        }
    }

    protected formattedStackOf( err: Error ): string {
        return "\n  DETAILS: " + err.stack.substring( err.stack.indexOf( "\n" ) );
    }

    // private formatHash( hash: string ): string {
    //     return this.colorInfo( hash.substr( 0, 8 ) );
    // }

    protected formatDuration( durationMs: number ): string {
        // if ( durationMs < 0 ) {
        //     return '';
        // }
        return this.colorDiscreet( '(' + durationMs.toString() + 'ms)' );
    }



}