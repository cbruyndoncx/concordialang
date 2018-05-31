import { Database } from '../ast/Database';
import { Table } from '../ast/Table';
import { UIElement, UIProperty } from '../ast/UIElement';
import { ConstantBlock } from '../ast/ConstantBlock';
import { RegexBlock } from '../ast/RegexBlock';
import { Document } from '../ast/Document';
import { Feature } from "../ast/Feature";
import { Scenario } from "../ast/Scenario";
import { Variant } from '../ast/Variant';
import { TestCase } from '../ast/TestCase';
import { Background } from '../ast/Background';
import { VariantBackground } from '../ast/VariantBackground';
import { BeforeAll, AfterAll, BeforeFeature, AfterFeature, BeforeEachScenario, AfterEachScenario } from '../ast/TestEvent';

/**
 * Parsing context.
 *
 * @author Thiago Delgado Pinto
 */
export class ParsingContext {

    doc: Document = {};

    inFeature: boolean = false;
    inBackground: boolean = false;
    inVariantBackground: boolean = false;
    inScenario: boolean = false;
    inScenarioVariantBackground: boolean = false;
    inVariant: boolean = false;
    inTestCase: boolean = false;
    inConstantBlock: boolean = false;
    inConstant: boolean = false;
    inRegexBlock: boolean = false;
    inRegex: boolean = false;
    inUIProperty: boolean = false;
    inTable: boolean = false;
    inBeforeAll: boolean = false;
    inAfterAll: boolean = false;
    inBeforeFeature: boolean = false;
    inAfterFeature: boolean = false;
    inBeforeEachScenario: boolean = false;
    inAfterEachScenario: boolean = false;

    currentBackground: Background = null;
    currentVariantBackground: VariantBackground = null;
    currentScenario: Scenario = null;
    currentScenarioVariantBackground: VariantBackground = null;
    currentVariant: Variant = null;
    currentTestCase: TestCase = null;
    currentUIElement: UIElement = null;
    currentUIProperty: UIProperty = null;
    currentConstantBlock: ConstantBlock = null;
    currentRegexBlock: RegexBlock = null;
    currentTable: Table = null;
    currentDatabase: Database = null;
    currentBeforeAll: BeforeAll = null;
    currentAfterAll: AfterAll = null;
    currentBeforeFeature: BeforeFeature = null;
    currentAfterFeature: AfterFeature = null;
    currentBeforeEachScenario: BeforeEachScenario = null;
    currentAfterEachScenario: AfterEachScenario = null;

    constructor( doc?: Document ) {
        if ( doc ) {
            this.doc = doc;
        }
    }

    public resetInValues(): void {
        this.inFeature = false;
        this.inBackground = false;
        this.inVariantBackground = false;
        this.inScenario = false;
        this.inScenarioVariantBackground = false;
        this.inVariant = false;
        this.inTestCase = false;
        this.inConstantBlock = false;
        this.inConstant = false;
        this.inRegexBlock = false;
        this.inRegex = false;
        this.inUIProperty = false;
        this.inTable = false;
        this.inBeforeAll = false;
        this.inAfterAll = false;
        this.inBeforeFeature = false;
        this.inAfterFeature = false;
        this.inBeforeEachScenario = false;
        this.inAfterEachScenario = false;
    }
}