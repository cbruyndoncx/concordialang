"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enumUtil = require("enum-util");
const path_1 = require("path");
const TypeChecking_1 = require("../util/TypeChecking");
const CaseType_1 = require("./CaseType");
const Defaults_1 = require("./Defaults");
/**
 * Application options
 *
 * @author Thiago Delgado Pinto
 */
class Options {
    constructor(appPath = __dirname, processPath = process.cwd()) {
        // console.log( 'App path (main.js)', appPath, 'Process path', processPath );
        this.appPath = appPath;
        this.processPath = processPath;
        // Default values - not updatable
        this.defaults = new Defaults_1.Defaults();
        /**
         * Parameters that should not be saved. The other parameters should only
         * be saved if they are different from the default ones (new Options()).
         */
        this.PARAMS_TO_IGNORE = [
            'PARAMS_TO_IGNORE',
            'defaults',
            'appPath',
            'processPath',
            // Language
            'languageList',
            // Plugin
            'pluginList',
            'pluginAbout',
            'pluginInstall',
            'pluginUninstall',
            'pluginServe',
            // Processing
            'init',
            'saveConfig',
            'ast',
            // Randomic generation
            'isGeneratedSeed',
            'realSeed',
            // Info
            'help',
            'about',
            'version',
            'newer',
            // Other
            'debug',
            'pluginDir',
            'languageDir'
        ];
        // Files
        this.directory = '.'; // directory to search
        this.recursive = true; // recursive search
        this.encoding = this.defaults.ENCODING; // change default encoding
        this.extensions = this.defaults.EXTENSIONS; // extensions to search // TO-DO: integrate this with extensionFeature and extensionTestCase
        this.ignore = []; // files to ignore, from the given directory
        this.files = []; // files to consider, instead of the given directory
        // Language
        this.language = this.defaults.LANGUAGE; // change default language
        this.languageList = false; // show available languages
        // Plugin
        this.plugin = null; // plug-in name
        this.pluginList = false; // show available plug-ins
        this.pluginAbout = false; // show information about a plug-in
        this.pluginInstall = false; // install an available plug-in
        this.pluginUninstall = false; // uninstall an available plug-in
        this.pluginServe = false; // start the test server of a plug-in
        // PROCESSING
        /** Whether it is wanted to execute a guided configuration */
        this.init = false;
        /** Whether it is desired to save/overwrite a configuration file */
        this.saveConfig = false;
        /** Generates an AST file instead of executing anything else */
        this.ast = null;
        /** Verbose output */
        this.verbose = false;
        /** Stop on the first error */
        this.stopOnTheFirstError = false;
        /** Whether it is desired to compile the specification */
        this.compileSpecification = true;
        /** Whether it is desired to generate test case files */
        this.generateTestCase = true;
        /** Whether it is desired to generate test script files */
        this.generateScript = true;
        /** Whether it is desired to execute test script files */
        this.executeScript = true;
        /** Whether it is desired to analyze test script results */
        this.analyzeResult = true;
        /** Output directory for test case files */
        this.dirTestCase = this.defaults.DIR_TEST_CASE;
        /** Output directory for test script files */
        this.dirScript = this.defaults.DIR_SCRIPT;
        /** Output directory of test script results */
        this.dirResult = this.defaults.DIR_SCRIPT_RESULT;
        /** Extension for feature files */
        this.extensionFeature = this.defaults.EXTENSION_FEATURE;
        /** Extension for test case files */
        this.extensionTestCase = this.defaults.EXTENSION_TEST_CASE;
        /** Characters used to break lines in text files */
        this.lineBreaker = this.defaults.LINE_BREAKER;
        // CONTENT GENERATION
        /**
         * String case used for UI Elements' ids when an id is not defined.
         *
         * @see CaseType
         */
        this.caseUi = this.defaults.CASE_UI;
        /**
         * String case used for test scripts' methods.
         *
         * @see CaseType
         */
        this.caseMethod = this.defaults.CASE_METHOD;
        /** Whether it is desired to suppress header comments in test case files */
        this.tcSuppressHeader = false;
        /** Character used as indenter for test case files */
        this.tcIndenter = this.defaults.TC_INDENTER;
        // RANDOMIC GENERATION
        /** Seed */
        this.seed = null;
        /** Indicates whether the seed was generated by Concordia or not */
        this.isGeneratedSeed = false;
        /**
         * Real seed to use. If the seed is less than 64 characters, the real seed
         * should be its SHA-512 hash.
         */
        this.realSeed = null;
        // /** Number of test cases with valid random values */
        // public randomValid: number = 1;
        // /** Number of test cases with invalid random values */
        // public randomInvalid: number = 1;
        /** Minimum size for random strings */
        this.randomMinStringSize = this.defaults.RANDOM_MIN_STRING_SIZE;
        /** Maximum size for random strings */
        this.randomMaxStringSize = this.defaults.RANDOM_MAX_STRING_SIZE;
        /** How many tries it will make to generate random values that are not in a set */
        this.randomTriesToInvalidValue = this.defaults.RANDOM_TRIES_TO_INVALID_VALUE;
        // SPECIFICATION SELECTION
        /** Default importance value */
        this.importance = this.defaults.IMPORTANCE;
        /** Minimum feature importance */
        this.selMinFeature = 0;
        /** Maximum feature importance */
        this.selMaxFeature = 0;
        /** Minimum scenario importance */
        this.selMinScenario = 0;
        /** Maximum scenario importance */
        this.selMaxScenario = 0;
        /** Filter by tags
         * @see https://github.com/telefonicaid/tartare#tags-and-filters */
        this.selFilter = '';
        // TEST SCENARIO SELECTION AND COMBINATION STRATEGIES
        /** @see VariantSelectionOptions */
        this.combVariant = this.defaults.VARIANT_SELECTION;
        /** @see StateCombinationOptions */
        this.combState = this.defaults.STATE_COMBINATION;
        // SELECTION AND COMBINATION STRATEGIES FOR DATA TEST CASES
        /** @see Defaults */
        this.combInvalid = this.defaults.INVALID_DATA_TEST_CASES_AT_A_TIME;
        /** @see DataTestCaseCombinationOptions */
        this.combData = this.defaults.DATA_TEST_CASE_COMBINATION;
        // Test script filtering
        this.runMinFeature = 0; // minimum feature importance
        this.runMaxFeature = 0; // maximum feature importance
        this.runMinScenario = 0; // minimum scenario importance
        this.runMaxScenario = 0; // maximum scenario importance
        this.runFilter = ''; // filter by tags @see https://github.com/telefonicaid/tartare#tags-and-filters
        // Info
        this.help = false; // show help
        this.about = false; // show about
        this.version = false; // show version
        this.newer = false; // check for version updates
        this.debug = false; // debug mode
        // Internal
        this.pluginDir = this.defaults.DIR_PLUGIN;
        this.languageDir = this.defaults.DIR_LANGUAGE;
        // @see https://github.com/zeit/pkg#assets
        // const isSnapshot = 0 === appPath.indexOf( '/snapshot' )
        //     || 0 === appPath.indexOf( 'C:\\snapshot' );
        // if ( isSnapshot ) {
        //     appPath = processPath; // Both plugins and languages are loaded dynamically
        // }
        // Concordia directories
        this.pluginDir = path_1.resolve(appPath, this.defaults.DIR_PLUGIN);
        this.languageDir = path_1.resolve(appPath, this.defaults.DIR_LANGUAGE);
        // User directories
        this.dirScript = path_1.resolve(processPath, this.defaults.DIR_SCRIPT);
        this.dirResult = path_1.resolve(processPath, this.defaults.DIR_SCRIPT_RESULT);
    }
    shouldSeeHelp() {
        return this.help
            && !this.about
            && !(this.someInfoOption());
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
    hasAnySpecificationFilter() {
        return this.hasFeatureFilter()
            || this.hasScenarioFilter()
            || this.hasTagFilter();
    }
    hasFeatureFilter() {
        return this.selMinFeature > 0 || this.selMaxFeature > 0;
    }
    hasScenarioFilter() {
        return this.selMinScenario > 0 || this.selMaxScenario > 0;
    }
    hasTagFilter() {
        return this.selFilter != '';
    }
    someInfoOption() {
        return this.help || this.about || this.version;
    }
    somePluginOption() {
        return this.pluginList || this.pluginAbout || this.pluginInstall || this.pluginUninstall || this.pluginServe;
    }
    someOptionThatRequiresAPlugin() {
        return this.generateScript || this.executeScript || this.analyzeResult;
    }
    hasPluginName() {
        return this.plugin !== null && this.plugin !== undefined;
    }
    typedCaseUI() {
        if (enumUtil.isValue(CaseType_1.CaseType, this.caseUi)) {
            return this.caseUi;
        }
        if (enumUtil.isValue(CaseType_1.CaseType, this.defaults.CASE_UI)) {
            return this.defaults.CASE_UI;
        }
        return CaseType_1.CaseType.CAMEL;
    }
    typedVariantSelection() {
        if (enumUtil.isValue(Defaults_1.VariantSelectionOptions, this.combVariant)) {
            return this.combVariant;
        }
        if (enumUtil.isValue(Defaults_1.VariantSelectionOptions, this.defaults.VARIANT_SELECTION)) {
            return this.defaults.VARIANT_SELECTION;
        }
        return Defaults_1.VariantSelectionOptions.SINGLE_RANDOM;
    }
    typedStateCombination() {
        return this.typedCombinationFor(this.combState, this.defaults.STATE_COMBINATION);
    }
    typedDataCombination() {
        return this.typedCombinationFor(this.combData, this.defaults.DATA_TEST_CASE_COMBINATION);
    }
    typedCombinationFor(value, defaultValue) {
        if (enumUtil.isValue(Defaults_1.CombinationOptions, value)) {
            return value;
        }
        if (enumUtil.isValue(Defaults_1.CombinationOptions, defaultValue)) {
            return defaultValue;
        }
        return Defaults_1.CombinationOptions.SHUFFLED_ONE_WISE;
    }
    /**
     * Set attributes from a given object.
     *
     * @param obj Object
     */
    import(obj) {
        const CURRENT_DIRECTORY = '.';
        const PARAM_SEPARATOR = ',';
        // FILES
        this.directory = obj.directory || CURRENT_DIRECTORY;
        this.recursive = obj.recursive !== false;
        if (TypeChecking_1.isString(obj.encoding)) {
            this.encoding = obj.encoding.trim().toLowerCase();
        }
        if (TypeChecking_1.isString(obj.extensions)) {
            this.extensions = obj.extensions.trim().split(PARAM_SEPARATOR);
        }
        if (TypeChecking_1.isString(obj.ignore)) {
            this.ignore = obj.ignore.trim().split(PARAM_SEPARATOR);
        }
        if (TypeChecking_1.isString(obj.files)) {
            this.files = obj.files.trim().split(PARAM_SEPARATOR);
        }
        else if (TypeChecking_1.isString(obj.file)) { // alternative
            this.files = obj.file.trim().split(PARAM_SEPARATOR);
        }
        // LANGUAGE
        if (TypeChecking_1.isString(obj.language)) {
            this.language = obj.language.trim().toLowerCase();
        }
        this.languageList = TypeChecking_1.isDefined(obj.languageList);
        // PLUG-IN
        // console.log( obj );
        if (TypeChecking_1.isString(obj.plugin)) {
            this.plugin = obj.plugin.trim().toLowerCase();
        }
        this.pluginList = TypeChecking_1.isDefined(obj.pluginList);
        if (TypeChecking_1.isString(obj.pluginAbout)) {
            if (obj.pluginAbout != '') {
                this.plugin = obj.pluginAbout.trim().toLowerCase();
            }
            this.pluginAbout = true;
        }
        else if (TypeChecking_1.isString(obj.pluginInfo)) { // Same as plugin about
            if (obj.pluginInfo != '') {
                this.plugin = obj.pluginInfo.trim().toLowerCase();
            }
            this.pluginAbout = true;
        }
        else if (TypeChecking_1.isString(obj.pluginInstall)) {
            if (obj.pluginInstall != '') {
                this.plugin = obj.pluginInstall.trim().toLowerCase();
            }
            this.pluginInstall = true;
        }
        else if (TypeChecking_1.isString(obj.pluginUninstall)) {
            if (obj.pluginUninstall != '') {
                this.plugin = obj.pluginUninstall.trim().toLowerCase();
            }
            this.pluginUninstall = true;
        }
        else if (TypeChecking_1.isString(obj.pluginServe)) {
            if (obj.pluginServe != '') {
                this.plugin = obj.pluginServe.trim().toLowerCase();
            }
            this.pluginServe = true;
        }
        // PROCESSING
        const ast = TypeChecking_1.isString(obj.ast)
            ? obj.ast
            : (TypeChecking_1.isDefined(obj.ast) ? this.defaults.AST_FILE : undefined);
        this.init = TypeChecking_1.isDefined(obj.init);
        this.saveConfig = TypeChecking_1.isDefined(obj.saveConfig);
        this.ast = ast;
        this.verbose = TypeChecking_1.isDefined(obj.verbose);
        this.stopOnTheFirstError = true === obj.failFast || true === obj.stopOnTheFirstError;
        // const justSpec: boolean = isDefined( obj.justSpec ) || isDefined( obj.justSpecification );
        const justTestCase = TypeChecking_1.isDefined(obj.justTestCase) || TypeChecking_1.isDefined(obj.justTestCases);
        const justScript = TypeChecking_1.isDefined(obj.justScript) || TypeChecking_1.isDefined(obj.justScripts);
        const justRun = TypeChecking_1.isDefined(obj.justRun);
        const justResult = TypeChecking_1.isDefined(obj.justResult) || TypeChecking_1.isDefined(obj.justResults);
        // compare to false is important because meow transforms no-xxx to xxx === false
        // const noSpec: boolean = false === obj.compileSpecification ||
        //     false === obj.spec ||
        //     false === obj.specification;
        const noTestCase = false === obj.generateTestCase ||
            false === obj.testCase ||
            false === obj.testCases ||
            false === obj.testcase;
        const noScript = false === obj.generateScript ||
            false === obj.script ||
            false === obj.scripts ||
            false === obj.testScript ||
            false == obj.testscript;
        const noRun = false == obj.executeScript ||
            false === obj.run ||
            false === obj.execute;
        const noResult = false === obj.analyzeResult ||
            false === obj.result ||
            false === obj.results;
        // Adjust flags
        this.generateTestCase = (!noTestCase || justTestCase)
            && (!justScript && !justRun && !justResult);
        this.generateScript = (!noScript || justScript)
            && (!justRun && !justResult);
        this.executeScript = (!noRun || justRun)
            && (!justResult);
        this.analyzeResult = (!noResult || justResult)
            && (!justRun);
        this.compileSpecification = this.generateTestCase || this.generateScript;
        // Directories
        if (TypeChecking_1.isString(obj.dirTestCase)) { // singular
            this.dirTestCase = obj.dirTestCase;
        }
        else if (TypeChecking_1.isString(obj.dirTestCases)) { // plural
            this.dirTestCase = obj.dirTestCases;
        }
        if (TypeChecking_1.isString(obj.dirScript)) { // singular
            this.dirScript = obj.dirScript;
        }
        else if (TypeChecking_1.isString(obj.dirScripts)) { // plural
            this.dirScript = obj.dirScripts;
        }
        if (TypeChecking_1.isString(obj.dirResult)) { // singular
            this.dirResult = obj.dirResult;
        }
        else if (TypeChecking_1.isString(obj.dirResults)) { // plural
            this.dirResult = obj.dirResults;
        }
        else if (TypeChecking_1.isString(obj.dirOutput)) { // alternative
            this.dirResult = obj.dirOutput;
        }
        if (TypeChecking_1.isString(obj.extensionFeature)) {
            this.extensionFeature = obj.extensionFeature;
        }
        else if (TypeChecking_1.isString(obj.extFeature)) { // similar
            this.extensionFeature = obj.extFeature;
        }
        if (TypeChecking_1.isString(obj.extensionTestCase)) {
            this.extensionTestCase = obj.extensionTestCase;
        }
        else if (TypeChecking_1.isString(obj.extTestCase)) { // similar
            this.extensionTestCase = obj.extTestCase;
        }
        if (TypeChecking_1.isString(obj.lineBreaker)) {
            this.lineBreaker = obj.lineBreaker;
        }
        else if (TypeChecking_1.isString(obj.lineBreak)) { // similar
            this.lineBreaker = obj.lineBreak;
        }
        // CONTENT GENERATION
        if (TypeChecking_1.isString(obj.caseUi)) {
            this.caseUi = obj.caseUi;
        }
        if (TypeChecking_1.isString(obj.caseMethod)) {
            this.caseMethod = obj.caseMethod;
        }
        this.tcSuppressHeader = TypeChecking_1.isDefined(obj.tcSuppressHeader);
        if (TypeChecking_1.isString(obj.tcIndenter)) {
            this.tcIndenter = obj.tcIndenter;
        }
        // RANDOMIC GENERATION
        if (TypeChecking_1.isString(obj.seed) || TypeChecking_1.isNumber(obj.seed)) {
            this.seed = String(obj.seed);
        }
        // if ( isNumber( flags.randomValid ) ) {
        //     this.randomValid = parseInt( flags.randomValid );
        // }
        // if ( isNumber( flags.randomInvalid ) ) {
        //     this.randomInvalid = parseInt( flags.randomInvalid );
        // }
        if (TypeChecking_1.isNumber(obj.randomMinStringSize)) {
            this.randomMinStringSize = parseInt(obj.randomMinStringSize);
        }
        if (TypeChecking_1.isNumber(obj.randomMaxStringSize)) {
            this.randomMaxStringSize = parseInt(obj.randomMaxStringSize);
        }
        if (TypeChecking_1.isNumber(obj.randomTries)) {
            this.randomTriesToInvalidValue = obj.randomTries;
        }
        // SPECIFICATION SELECTION
        if (TypeChecking_1.isNumber(obj.importance)) {
            this.importance = parseInt(obj.importance);
        }
        if (TypeChecking_1.isNumber(obj.selMinFeature)) {
            this.selMinFeature = parseInt(obj.selMinFeature);
        }
        if (TypeChecking_1.isNumber(obj.selMaxFeature)) {
            this.selMaxFeature = parseInt(obj.selMaxFeature);
        }
        if (TypeChecking_1.isNumber(obj.selMinScenario)) {
            this.selMinScenario = parseInt(obj.selMinScenario);
        }
        if (TypeChecking_1.isNumber(obj.selMaxScenario)) {
            this.selMaxScenario = parseInt(obj.selMaxScenario);
        }
        if (TypeChecking_1.isString(obj.selFilter)) {
            this.selFilter = obj.selFilter;
        }
        // TEST SCENARIO SELECTION AND COMBINATION STRATEGIES
        if (TypeChecking_1.isString(obj.combVariant)
            && enumUtil.isValue(Defaults_1.VariantSelectionOptions, obj.combVariant)) {
            this.combVariant = obj.combVariant;
        }
        if (TypeChecking_1.isString(obj.combState)
            && enumUtil.isValue(Defaults_1.CombinationOptions, obj.combState)) {
            this.combState = obj.combState;
        }
        // SELECTION AND COMBINATION STRATEGIES FOR DATA TEST CASES
        if (TypeChecking_1.isNumber(obj.combInvalid) && Number(obj.combInvalid) >= 0) {
            this.combInvalid = parseInt(obj.combInvalid);
        }
        else if (TypeChecking_1.isString(obj.combInvalid)) {
            this.combInvalid = obj.combInvalid;
        }
        if (TypeChecking_1.isString(obj.combData)
            && enumUtil.isValue(Defaults_1.CombinationOptions, obj.combData)) {
            this.combData = obj.combData;
        }
        // TEST SCRIPT FILTERING
        if (TypeChecking_1.isNumber(obj.runMinFeature)) {
            this.runMinFeature = parseInt(obj.runMinFeature);
        }
        if (TypeChecking_1.isNumber(obj.runMaxFeature)) {
            this.runMaxFeature = parseInt(obj.runMaxFeature);
        }
        if (TypeChecking_1.isNumber(obj.runMinScenario)) {
            this.runMinScenario = parseInt(obj.runMinScenario);
        }
        if (TypeChecking_1.isNumber(obj.runMaxScenario)) {
            this.runMaxScenario = parseInt(obj.runMaxScenario);
        }
        if (TypeChecking_1.isString(obj.runFilter)) {
            this.runFilter = obj.runFilter;
        }
        // INFO
        this.help = TypeChecking_1.isDefined(obj.help);
        this.about = TypeChecking_1.isDefined(obj.about);
        this.version = TypeChecking_1.isDefined(obj.version);
        this.newer = TypeChecking_1.isDefined(obj.newer);
        this.debug = TypeChecking_1.isDefined(obj.debug);
        this.fixInconsistences();
    }
    /**
     * Fix inconsistences
     */
    fixInconsistences() {
        // LANGUAGE
        this.languageList = this.languageList && !this.help; // Help flag takes precedence over other flags
        // PLUG-IN
        this.pluginList = this.pluginList && !this.help; // Help flag takes precedence over other flags
        this.pluginAbout = this.pluginAbout && !this.pluginList;
        this.pluginInstall = this.pluginInstall && !this.pluginAbout && !this.pluginList;
        this.pluginUninstall = this.pluginUninstall && !this.pluginAbout && !this.pluginList;
        this.pluginServe = this.pluginServe && !this.pluginAbout && !this.pluginList;
        // RANDOMIC GENERATION
        // if ( this.randomValid < 0 ) {
        //     this.randomValid = 0;
        // }
        // if ( this.randomInvalid < 0 ) {
        //     this.randomInvalid = 0;
        // }
        // SPECIFICATION SELECTION
        if (this.selMinFeature < 0) {
            this.selMinFeature = 0;
        }
        if (this.selMaxFeature < 0) {
            this.selMaxFeature = 0;
        }
        if (this.selMinScenario < 0) {
            this.selMinScenario = 0;
        }
        if (this.selMaxScenario < 0) {
            this.selMaxScenario = 0;
        }
        // TEST SCRIPT FILTERING
        if (this.runMinFeature < 0) {
            this.runMinFeature = 0;
        }
        if (this.runMaxFeature < 0) {
            this.runMaxFeature = 0;
        }
        if (this.runMinScenario < 0) {
            this.runMinScenario = 0;
        }
        if (this.runMaxScenario < 0) {
            this.runMaxScenario = 0;
        }
        // INFO
        // - Help flag takes precedence over other flags
        this.about = this.about && !this.help;
        this.version = this.version && !this.help;
        this.newer = this.newer && !this.help;
    }
    /**
     * Returns an object that can be saved.
     */
    export() {
        const newOptions = new Options(this.appPath, this.processPath);
        let obj = {};
        let paramsToIgnore = this.PARAMS_TO_IGNORE.slice(0); // copy
        // Individual cases
        if (this.isGeneratedSeed) {
            paramsToIgnore.push('seed');
        }
        // Convert
        for (let p in this) {
            let pType = typeof p;
            if ('function' === pType) {
                // console.log( 'function', p );
                continue;
            }
            if (paramsToIgnore.indexOf(p) >= 0) {
                // console.log( 'ignored property', p );
                continue;
            }
            // Equal arrays
            if (Array.isArray(this[p])
                && JSON.stringify(this[p]) === JSON.stringify(newOptions[p])) {
                // console.log( 'equal arrays', p );
                continue;
            }
            // Same values? Ignore
            if (this[p] === newOptions[p]) {
                // console.log( 'same values', p );
                continue;
            }
            obj[p.toString()] = this[p];
            // console.log( 'copied', p );
        }
        return obj;
    }
}
exports.Options = Options;
