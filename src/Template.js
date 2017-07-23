export default function (src, debug, delimiters) {
    let index = -1;

    // Seeks the next start delimiter in the template,
    // updates the position of the index and returns the index type as a string: 'print', 'comment', or 'logic'.
    let seekStart = () => {
        let indexes = [['print', delimiters.startPrint], ['comment', delimiters.startComment], ['logic', delimiters.startLogic]].map((startDelimiter) => {
            return [startDelimiter[0], src.indexOf(startDelimiter[1], index)];
        }).filter((index) => {
            return index[1] !== -1;
        }).sort((index1, index2) => {
            return index1[1] > index2[1];
        });

        if (indexes.length === 0) {
            return null;
        }

        index = indexes[0][1];
        return indexes[0][0];
    }

    // Seeks the end  of the block, updates the index to the end of the block,
    // and returns the contents of the block.
    let blockData = (type, startDelimiter, endDelimiter) => {
        let end = src.indexOf(endDelimiter, index);
        if (end === -1) {
            throw new Error('Unterminated ' + type + ' block in: ' + src);
        }
        end = end + endDelimiter.length;

        let block = src.substring(index, end);
        index = end;

        return block.substring(startDelimiter.length, block.length - endDelimiter.length).trim();
    }

    // Compiles the template into a function.
    let lastIndex = 0;
    let nextType;
    let compiled = 'var compiled = "';
    while ((nextType = seekStart()) !== null) {
        compiled += src.substring(lastIndex, index).replace(/\r?\n|\r/g, '\\n');

        if (nextType === 'print') {
            compiled += '" + ' + blockData('print', delimiters.startPrint, delimiters.endPrint) + ' + "';
        }

        if (nextType === 'comment') {
            blockData('comment', delimiters.startComment, delimiters.endComment);
        }

        if (nextType === 'logic') {
            compiled += '";';
            compiled += blockData('logic', delimiters.startLogic, delimiters.endLogic);
            compiled += 'compiled += "';
        }

        lastIndex = index;
    }
    compiled += src.substring(index).replace(/\r?\n|\r/g, '\\n') + '";';
    compiled += 'return compiled;';

    // Output template function if this is debug mode.
    if (debug === true) {
        console.log('Template compiled');
        console.log(compiled);
    }

    this.render = new Function('vars', compiled);
}
