
import * as _ from 'lodash';

import {Canto} from '../canti-divina-commedia-model/canti-divina-commedia-model';

export function transformCanto(canto: Canto, outputDir: string) {
    const transformedContent = canto.content.map((line, sequence) => transformLine(line, sequence));
    const cantoTransformed: Canto = {
        name: outputDir + canto.name,
        content: transformedContent
    };
    return cantoTransformed;
}

function transformLine(line: string, sequence: number) {
    const sequenceString = sequence + '';
    const sequenceStringPadded = _.padStart(sequenceString, 3) + '   ';
    return sequenceStringPadded + line;
}
