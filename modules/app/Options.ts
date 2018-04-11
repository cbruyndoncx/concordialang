import { resolve } from 'path';
import { Defaults } from './Defaults';
import { CaseType } from './CaseType';
import { isString, isNumber, isDefined } from '../util/TypeChecking';

/**
 * Application options
 *
 * @author Thiago Delgado Pinto
 */
export class Options {

    // Default values - not updatable
    public readonly defaults: Defaults = new Defaults();

    // Files
    public directory: string = '.'; // directory to search
    public recursive: boolean = true; // recursive search
    public encoding: string = this.defaults.ENCODING; // change default encoding
    public extensions: string[] = this.defaults.EXTENSIONS; // extensions to search // TO-DO: make it a method the returns extensionFeature and extensionTestCase
    public ignore: string[] = []; // files to ignore, from the given directory
    public files: string[] = []; // files to consider, instead of the given directory

    // Language
    public language: string = this.defaults.LANGUAGE; // change default language
    public languageList: boolean = false; // show available languages

    // Plugin
    public plugin: string = null; // plug-in name
    public pluginList: boolean = false; // show available plug-ins
    public pluginAbout: boolean = false; // show information about a plug-in
    public pluginInstall: boolean = false; // install an available plug-in
    public pluginUninstall: boolean = false; // uninstall an available plug-in

    // Processing
    public verbose: boolean = false; // verbose output
    public stopOnTheFirstError: boolean = false; // stop on the first error
    public compileSpecification: boolean = true;
    public generateTestCases: boolean = true; // generate test cases
    public generateScripts: boolean = true; // generate test scripts through a plugin
    public executeScripts: boolean = true; // execute test scripts through a plugin
    public analyzeResults: boolean = true; // analyze execution results through a plugin
    public dirTestCases: string = this.directory; // output directory for test cases
    public dirScripts: string = this.defaults.DIR_SCRIPT; // output directory for test scripts
    public dirResult: string = this.defaults.DIR_SCRIPT_RESULT; // output directory of test script results
    public extensionFeature: string = this.defaults.EXTENSION_FEATURE; // extension for feature files // TO-DO: convert from meow
    public extensionTestCase: string = this.defaults.EXTENSION_TEST_CASE; // extension for test case files // TO-DO: convert from meow
    public lineBreaker: string = this.defaults.LINE_BREAKER; // TO-DO: convert from meow

    // Code generation
    public caseUi: string = this.defaults.CASE_UI; // string case used for UI Elements' ids when an id is not defined
    public caseMethod: string = this.defaults.CASE_METHOD; // string case used for test scripts' methods

    // Randomic generation
    public seed: string = null; // random seed to use (null will make the tool to generate a seed)
    public randomValid: number = 1; // number of test cases with valid random values
    public randomInvalid: number = 1; // number of test cases with invalid random values

    // Specification selection
    public selMinFeature: number = 0; // minimum feature importance
    public selMaxFeature: number = 0; // maximum feature importance
    public selMinScenario: number = 0; // minimum scenario importance
    public selMaxScenario: number = 0; // maximum scenario importance
    public selFilter: string = ''; // filter by tags @see https://github.com/telefonicaid/tartare#tags-and-filters

    // Combination strategies
    public selVariant: string = this.defaults.SEL_VARIANT; // random|first|fmi|all
    public selState: string = this.defaults.SEL_STATE; // sow|onewise|all

    // Test script filtering
    public runMinFeature: number = 0; // minimum feature importance
    public runMaxFeature: number = 0; // maximum feature importance
    public runMinScenario: number = 0; // minimum scenario importance
    public runMaxScenario: number = 0; // maximum scenario importance
    public runFilter: string = ''; // filter by tags @see https://github.com/telefonicaid/tartare#tags-and-filters

    // Info
    public help: boolean = false; // show help
    public about: boolean = false; // show about
    public version: boolean = false; // show version
    public newer: boolean = false; // check for version updates
    public debug: boolean = false; // debug mode

    // Internal
    public pluginDir: string = this.defaults.DIR_PLUGIN;
    public languageDir: string = this.defaults.DIR_LANGUAGE;


    constructor(
        public appPath: string = process.cwd(),
        public processPath: string = process.cwd()
    ) {
        // Concordia directories
        this.pluginDir = resolve( appPath, this.defaults.DIR_PLUGIN );
        this.languageDir = resolve( appPath, this.defaults.DIR_LANGUAGE );

        // User directories
        this.dirScripts = resolve( processPath, this.defaults.DIR_SCRIPT );
        this.dirResult = resolve( processPath, this.defaults.DIR_SCRIPT_RESULT );
    }


    public shouldSeeHelp(): boolean {
        return this.help
            && ! this.about
            && ! ( this.someInfoOption() )
            ;
        /*
        ! this.seeAbout
            || ! ( this.someInfoOption() )
            || ( this.seeHelp
                // or do not want to do anything
                ||
                ( ! this.somePluginOption()
                && ! this.wantToCompile
                && ! this.wantToGenerateTestCases
                && ! this.wantToGenerateScripts
                && ! this.wantToExecuteScripts
                && ! this.wantToReadResults )
                // or want to do somethng with a plugin but its name is not defined
                ||
                ( ! this.pluginName &&
                    ( this.wantToGenerateScripts
                    ||  this.wantToExecuteScripts
                    || this.wantToReadResults )
                )
            );
            */
    }

    public someInfoOption(): boolean {
        return this.help || this.about || this.version;
    }

    public somePluginOption(): boolean {
        return this.pluginList || this.pluginAbout || this.pluginInstall || this.pluginUninstall;
    }

    public someOptionThatRequiresAPlugin(): boolean {
        return this.generateScripts || this.executeScripts || this.analyzeResults;
    }

    public hasPluginName(): boolean {
        return this.plugin !== null && this.plugin !== undefined;
    }

    /**
     * Set attributes from a meow object.
     */
    fromMeow = ( obj: any ): void => {

        const CURRENT_DIRECTORY = '.';
        const PARAM_SEPARATOR: string = ',';

        const flags = obj.flags;
        const input = obj.input;

        // FILES

        this.directory = isDefined( flags.directory )
            ? flags.directory
            : ( isDefined( input ) && 1 === input.length )
                ? input[ 0 ]
                : CURRENT_DIRECTORY;

        this.recursive = flags.recursive !== false;

        if ( isString( flags.encoding ) ) {
            this.encoding = flags.encoding.trim().toLowerCase();
        }
        if ( isString( flags.extensions ) ) {
            this.extensions = flags.extensions.trim().split( PARAM_SEPARATOR );
        }
        if ( isString( flags.ignore ) ) {
            this.ignore = flags.ignore.trim().split( PARAM_SEPARATOR );
        }
        if ( isString( flags.files ) ) {
            this.files = flags.files.trim().split( PARAM_SEPARATOR );
        }

        // LANGUAGE

        if ( isString( flags.language ) ) {
            this.language = flags.language.trim().toLowerCase();
        }

        this.languageList = isDefined( flags.languageList );

        // PLUG-IN

        if ( isString( flags.plugin ) ) {
            this.plugin = flags.plugin.trim().toLowerCase();
        }

        this.pluginList = isDefined( flags.pluginList );

        if ( isString( flags.pluginAbout ) ) {
            this.plugin = flags.pluginAbout.trim().toLowerCase();
            this.pluginAbout = true;
        }
        if ( isString( flags.pluginInstall ) ) {
            this.plugin = flags.pluginInstall.trim().toLowerCase();
            this.pluginInstall = true;
        }
        if ( isString( flags.pluginUninstall ) ) {
            this.plugin = flags.pluginUninstall.trim().toLowerCase();
            this.pluginUninstall = true;
        }

        // PROCESSING

        this.verbose = isDefined( flags.verbose );
        this.stopOnTheFirstError = isDefined( flags.failFast );

        const justSpec: boolean = isDefined( flags.justSpec ) || isDefined( flags.justSpecification );
        const justTestCases: boolean = isDefined( flags.justTestCases ) || isDefined( flags.justTestCase );
        const justScripts: boolean = isDefined( flags.justScripts ) || isDefined( flags.justScript );
        const justRun: boolean = isDefined( flags.justRun );
        const justResults: boolean = isDefined( flags.justResults ) || isDefined( flags.justResult );

        // compare to false is important because meow transforms no-xxx to xxx === false
        const noSpec: boolean = false === flags.spec || false === flags.specification;
        const noTestCases: boolean = false === flags.testCase || false === flags.testCases;
        const noScripts: boolean = false === flags.scripts || false === flags.script;
        const noRun: boolean = false === flags.run;
        const noResults: boolean = false === flags.results || false === flags.result;

        this.compileSpecification = ! noSpec || justSpec || justTestCases || justScripts;
        this.generateTestCases = ! noTestCases || justTestCases;
        this.generateScripts = ! noScripts || justScripts;
        this.executeScripts = ! noRun || justRun;
        this.analyzeResults = ! noResults || justResults;

        if ( isString( flags.dirExample ) ) {
            this.dirTestCases = flags.dirExample.trim().toLowerCase();
        } else if ( isString( flags.dirExamples ) ) {
            this.dirTestCases = flags.dirExamples.trim().toLowerCase();
        }
        if ( isString( flags.dirScript ) ) {
            this.dirScripts = flags.dirScript.trim().toLowerCase();
        } else if ( isString( flags.dirScripts ) ) {
            this.dirScripts = flags.dirScripts.trim().toLowerCase();
        }
        if ( isString( flags.dirResult ) ) {
            this.dirResult = flags.dirResult.trim().toLowerCase();
        } else if ( isString( flags.dirResults ) ) {
            this.dirResult = flags.dirResults.trim().toLowerCase();
        }

        // CODE GENERATION
        if ( isString( flags.caseUi ) ) {
            this.caseUi = flags.caseUi;
        }
        if ( isString( flags.caseMethod ) ) {
            this.caseMethod = flags.caseMethod;
        }

        // RANDOMIC GENERATION

        if ( isString( flags.seed ) ) {
            this.seed = flags.seed;
        }
        if ( isNumber( flags.randomValid ) ) {
            this.randomValid = parseInt( flags.randomValid );
        }
        if ( isNumber( flags.randomInvalid ) ) {
            this.randomInvalid = parseInt( flags.randomInvalid );
        }

        // SPECIFICATION SELECTION

        if ( isNumber( flags.selMinFeature ) ) {
            this.selMinFeature = parseInt( flags.selMinFeature );
        }
        if ( isNumber( flags.selMaxFeature ) ) {
            this.selMaxFeature = parseInt( flags.selMaxFeature );
        }
        if ( isNumber( flags.selMinScenario ) ) {
            this.selMinScenario = parseInt( flags.selMinScenario );
        }
        if ( isNumber( flags.selMaxScenario ) ) {
            this.selMaxScenario = parseInt( flags.selMaxScenario );
        }
        if ( isString( flags.selFilter ) ) {
            this.selFilter = flags.selFilter;
        }

        // COMBINATION STRATEGIES
        if ( isString( flags.selVariant ) ) {
            this.selVariant = flags.selVariant;
        }
        if ( isString( flags.selState ) ) {
            this.selState = flags.selState;
        }

        // TEST SCRIPT FILTERING

        if ( isNumber( flags.runMinFeature ) ) {
            this.runMinFeature = parseInt( flags.runMinFeature );
        }
        if ( isNumber( flags.runMaxFeature ) ) {
            this.runMaxFeature = parseInt( flags.runMaxFeature );
        }
        if ( isNumber( flags.runMinScenario ) ) {
            this.runMinScenario = parseInt( flags.runMinScenario );
        }
        if ( isNumber( flags.runMaxScenario ) ) {
            this.runMaxScenario = parseInt( flags.runMaxScenario );
        }
        if ( isString( flags.runFilter ) ) {
            this.runFilter = flags.runFilter;
        }

        // INFO
        this.help = isDefined( flags.help );
        this.about = isDefined( flags.about );
        this.version = isDefined( flags.version );
        this.newer = isDefined( flags.newer );
        this.debug = isDefined( flags.debug );

        this.fixInconsistences();
    };


    /**
     * Fix inconsistences
     */
    fixInconsistences(): void {

        // FILES
        // (nothing)

        // LANGUAGE
        this.languageList = this.languageList && ! this.help; // Help flag takes precedence over other flags

        // PLUG-IN
        this.pluginList = this.pluginList && ! this.help; // Help flag takes precedence over other flags
        this.pluginAbout = this.pluginAbout && ! this.pluginList;
        this.pluginInstall = this.pluginInstall && ! this.pluginAbout && ! this.pluginList;
        this.pluginUninstall = this.pluginUninstall && ! this.pluginInstall && ! this.pluginAbout && ! this.pluginList;

        // PROCESSING
        // (nothing)

        // RANDOMIC GENERATION
        if ( this.randomValid < 0 ) {
            this.randomValid = 0;
        }
        if ( this.randomInvalid < 0 ) {
            this.randomInvalid = 0;
        }

        // SPECIFICATION SELECTION
        if ( this.selMinFeature < 0 ) {
            this.selMinFeature = 0;
        }
        if ( this.selMaxFeature < 0 ) {
            this.selMaxFeature = 0;
        }
        if ( this.selMinScenario < 0 ) {
            this.selMinScenario = 0;
        }
        if ( this.selMaxScenario < 0 ) {
            this.selMaxScenario = 0;
        }

        // TEST SCRIPT FILTERING
        if ( this.runMinFeature < 0 ) {
            this.runMinFeature = 0;
        }
        if ( this.runMaxFeature < 0 ) {
            this.runMaxFeature = 0;
        }
        if ( this.runMinScenario < 0 ) {
            this.runMinScenario = 0;
        }
        if ( this.runMaxScenario < 0 ) {
            this.runMaxScenario = 0;
        }

        // INFO
        // - Help flag takes precedence over other flags
        this.about = this.about && ! this.help;
        this.version = this.version && ! this.help;
        this.newer = this.newer && ! this.help;
    }

    /*
    validate(): string[] {

        let errors: string[] = [];
        let def = new Defaults();

        if ( def.availableLanguages().indexOf( this.language ) < 0 ) {
            errors.push( 'Language ' + this.language + ' not available.' );
        }

        if ( def.availableEncodings().indexOf( this.encoding ) < 0 ) {
            errors.push( 'Encoding ' + this.encoding + ' not available.' );
        }

        return errors;
    }
    */

}