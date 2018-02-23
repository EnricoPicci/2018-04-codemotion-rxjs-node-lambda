"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
function transformCanto(canto, outputDir) {
    const transformedContent = canto.content.map((line, sequence) => transformLine(line, sequence));
    const cantoTransformed = {
        name: outputDir + canto.name,
        content: transformedContent
    };
    return cantoTransformed;
}
exports.transformCanto = transformCanto;
function transformLine(line, sequence) {
    const sequenceString = sequence + '';
    const sequenceStringPadded = _.padStart(sequenceString, 3) + '   ';
    return sequenceStringPadded + line;
}
//# sourceMappingURL=transform-canto.js.map