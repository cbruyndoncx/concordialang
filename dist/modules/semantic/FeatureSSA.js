"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureSSA = void 0;
const SpecificationAnalyzer_1 = require("./SpecificationAnalyzer");
/**
 * Executes semantic analysis of Features in a specification.
 *
 * Checkings:
 * - duplicated names
 *
 * @author Thiago Delgado Pinto
 */
class FeatureSSA extends SpecificationAnalyzer_1.SpecificationAnalyzer {
    /** @inheritDoc */
    analyze(graph, spec, errors) {
        return __awaiter(this, void 0, void 0, function* () {
            this._checker.checkDuplicatedNamedNodes(spec.features(), errors, 'feature');
        });
    }
}
exports.FeatureSSA = FeatureSSA;
