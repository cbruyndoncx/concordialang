/**
 * Application options
 */
export interface AppOptions {

	// INTERNAL

	/** Debug mode */
	debug?: boolean;

	appPath: string;
	processPath: string;

	languageDir: string;

	// Seed

    /** Indicates whether the seed was generated by Concordia or not */
    isGeneratedSeed?: boolean;
    /**
     * Real seed to use. If the seed is less than 64 characters, the real seed
     * should be its SHA-512 hash.
     */
    realSeed?: string;

    // DIRECTORIES

    /** Recursive search flag */
    recursive?: boolean;
    /** Directory with specification files */
    directory?: string;
    /** Output directory for test script files */
    dirScript?: string;
    /** Output directory of test script results */
    dirResult?: string;

    // FILES

    /** Files to ignore, from the given directory */
    ignore?: string[];
    /** Files to consider, instead of the given directory */
    file?: string[];
    /** Script files to execute */
    scriptFile?: string[];
    /** Send an expression to filter the test scripts to run. Some plug-ins may not support it. */
    scriptGrep?: string;

    // FILE-RELATED OPTIONS

    /** Default encoding */
	encoding?: string;
    /** Extension for feature files */
    extensionFeature?: string;
    /** Extension for test case files */
    extensionTestCase?: string;
    /** Characters used to break lines in text files */
    lineBreaker?: string;

	// LANGUAGE

	/** Default language */
    language?: string;

    // PLUGIN

    /** Plug-in (name) to use */
    plugin?: string;

    /** Target browsers or platforms */
    target?: string;
    /** Headless test script execution. Browsers only. Some plug-ins may not support it. */
    headless?: boolean;
    /** Parallel instances to run. Some plug-ins may not support it. */
	instances?: number;


    // PROCESSING

    /** Verbose output */
    verbose?: boolean;
    /** Stop on the first error */
    stopOnTheFirstError?: boolean;
    /** Whether it is desired to compile the specification */
    spec?: boolean;
    /** Whether it is desired to generate test case files */
    testCase?: boolean;
    /** Whether it is desired to generate test script files */
    script?: boolean;
    /** Whether it is desired to execute test script files */
    run?: boolean;
    /** Whether it is desired to analyze test script results */
    result?: boolean;

    // CONTENT GENERATION

    /**
     * String case used for UI Elements' ids when an id is not defined.
     *
     * @see CaseType
     */
    caseUi?: string;

    /** Whether it is desired to suppress header comments in test case files */
    tcSuppressHeader?: boolean;

    /** Character used as indenter for test case files */
    tcIndenter?: string;


    // RANDOMIC GENERATION

    /** Seed */
    seed?: string;

    // /** Number of test cases with valid random values */
    // randomValid?: number = 1;
    // /** Number of test cases with invalid random values */
    // randomInvalid?: number = 1;
    /** Minimum size for random strings */
    randomMinStringSize?: number;
    /** Maximum size for random strings */
    randomMaxStringSize?: number;
    /** How many tries it will make to generate random values that are not in a set */
    randomTriesToInvalidValue?: number;

    // SPECIFICATION SELECTION

    /** Default importance value */
    importance?: number;

    // TEST SCENARIO SELECTION AND COMBINATION STRATEGIES

    /** @see VariantSelectionOptions */
    combVariant?: string;

    /** @see StateCombinationOptions */
    combState?: string;

    // SELECTION AND COMBINATION STRATEGIES FOR DATA TEST CASES

    /** @see InvalidSpecialOptions */
	combInvalid?: number | string;

    /** @see DataTestCaseCombinationOptions */
    combData?: string;

}


export function hasSomeOptionThatRequiresAPlugin( o: AppOptions ): boolean {
	return o.script || o.run || o.result;
}
