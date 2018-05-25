"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ReferenceReplacer_1 = require("../../modules/util/ReferenceReplacer");
/**
 * @author Thiago Delgado Pinto
 */
describe('ReferenceReplacerTest', () => {
    let replacer = new ReferenceReplacer_1.ReferenceReplacer(); // under test   
    it('replaces a query', () => {
        const query = 'SELECT [table1].fieldX, tbl2.fieldY, [table2].fieldY ' +
            'FROM [db].[table1], [table2], tbl3 ' +
            'LEFT JOIN [table3] AS tbl3' +
            '  ON tbl3.someField = {fieldB} ' +
            'WHERE [table1].fieldX = {fieldA} OR ' +
            '[table2].fieldY = [const1] OR [table3].x = [const2]';
        const result = replacer.replaceQuery(query, new Map([
            ['db', 'mydb']
        ]), new Map([
            ['table1', 'user'],
            ['table2', 'customer'],
            ['table3', 'employee']
        ]), new Map([
            ['fieldA', 'Jack'],
            ['fieldB', 100]
        ]), new Map([
            ['const1', 'administrator'],
            ['const2', 200]
        ]));
        const expected = 'SELECT `user`.fieldX, tbl2.fieldY, `customer`.fieldY ' +
            'FROM `mydb`.`user`, `customer`, tbl3 ' +
            'LEFT JOIN `employee` AS tbl3' +
            '  ON tbl3.someField = 100 ' +
            'WHERE `user`.fieldX = \'Jack\' OR ' +
            '`customer`.fieldY = \'administrator\' OR `employee`.x = 200';
        expect(result).toBe(expected);
    });
});
