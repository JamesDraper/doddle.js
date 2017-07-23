(function () {
var Template = function (src, debug, delimiters) {
    var index = -1;

    // Seeks the next start delimiter in the template,
    // updates the position of the index and returns the index type as a string: 'print', 'comment', or 'logic'.
    var seekStart = function seekStart() {
        var indexes = [['print', delimiters.startPrint], ['comment', delimiters.startComment], ['logic', delimiters.startLogic]].map(function (startDelimiter) {
            return [startDelimiter[0], src.indexOf(startDelimiter[1], index)];
        }).filter(function (index) {
            return index[1] !== -1;
        }).sort(function (index1, index2) {
            return index1[1] > index2[1];
        });

        if (indexes.length === 0) {
            return null;
        }

        index = indexes[0][1];
        return indexes[0][0];
    };

    // Seeks the end  of the block, updates the index to the end of the block,
    // and returns the contents of the block.
    var blockData = function blockData(type, startDelimiter, endDelimiter) {
        var end = src.indexOf(endDelimiter, index);
        if (end === -1) {
            throw new Error('Unterminated ' + type + ' block in: ' + src);
        }
        end = end + endDelimiter.length;

        var block = src.substring(index, end);
        index = end;

        return block.substring(startDelimiter.length, block.length - endDelimiter.length).trim();
    };

    // Compiles the template into a function.
    var lastIndex = 0;
    var nextType = void 0;
    var compiled = 'var compiled = "';
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
};

var Renderer = function (options) {
    var DEFAULTS = {
        startPrintDelimiter: '{{',
        endPrintDelimiter: '}}',
        startCommentDelimiter: '{#',
        endCommentDelimiter: '#}',
        startLogicDelimiter: '{%',
        endLogicDelimiter: '%}',
        debug: false
    };

    var config = function (options) {
        var fullOptions = {};
        for (var k in DEFAULTS) {
            fullOptions[k] = options[k] !== undefined ? options[k] : DEFAULTS[k];
        }

        return {
            debug: fullOptions.debug,
            delimiters: {
                startPrint: fullOptions.startPrintDelimiter,
                endPrint: fullOptions.endPrintDelimiter,
                startComment: fullOptions.startCommentDelimiter,
                endComment: fullOptions.endCommentDelimiter,
                startLogic: fullOptions.startLogicDelimiter,
                endLogic: fullOptions.endLogicDelimiter
            }
        };
    }(options);

    var cache = {};

    var findTemplate = function findTemplate(id) {
        var scripts = document.getElementsByTagName('script');
        for (var i in scripts) {
            if (scripts[i].type === 'text/doddle-template' && scripts[i].id === id) {
                return scripts[i];
            }
        }

        throw new Error('Could not find template: ' + id + '.');
    };

    this.fromString = function (elem, src, vars) {
        var cacheId = 'str:' + src;
        if (cache[cacheId] === undefined) {
            cache[cacheId] = new Template(src, config.debug, config.delimiters);
        }
        elem.innerHTML = cache[cacheId].render(vars);
    };

    this.fromTemplate = function (elem, id, vars) {
        var cacheId = 'tpl:' + id;
        if (cache[cacheId] === undefined) {
            cache[cacheId] = new Template(findTemplate(id).innerHTML, config.debug, config.delimiters);
        }
        elem.innerHTML = cache[cacheId].render(vars);
    };
};

var Doddle = function () {
    var renderers = {};

    var findRenderer = function findRenderer(options) {
        var key = JSON.stringify(options);
        if (renderers[key] === undefined) {
            renderers[key] = new Renderer(options);
        }

        return renderers[key];
    };

    this.fromString = function (elem, src, vars) {
        var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

        return findRenderer(options).fromString(elem, src, vars);
    };

    this.fromTemplate = function (elem, id, vars) {
        var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

        return findRenderer(options).fromTemplate(elem, id, vars);
    };
};

doddle = function () {
    return new Doddle();
}();

}());
