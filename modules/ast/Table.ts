import { Node, NamedNode } from './Node';

/**
 * Table node.
 * 
 * @author Thiago Delgado Pinto
 */
export interface Table extends NamedNode {
    rows: TableRow[];
}

/**
 * Table row node.
 * 
 * @author Thiago Delgado Pinto
 */
export interface TableRow extends Node {
    cells: string[];
}