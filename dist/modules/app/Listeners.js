"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectoryReadResult = void 0;
class DirectoryReadResult {
    constructor(dirCount, filesCount, filesSize, durationMs, fileErrorCount) {
        this.dirCount = dirCount;
        this.filesCount = filesCount;
        this.filesSize = filesSize;
        this.durationMs = durationMs;
        this.fileErrorCount = fileErrorCount;
    }
}
exports.DirectoryReadResult = DirectoryReadResult;
