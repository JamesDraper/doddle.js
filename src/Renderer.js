import Template from './Template.js';

export default function(options) {
    const DEFAULTS = {
        startPrintDelimiter: '{{',
        endPrintDelimiter: '}}',
        startCommentDelimiter: '{#',
        endCommentDelimiter: '#}',
        startLogicDelimiter: '{%',
        endLogicDelimiter: '%}',
        debug: false,
    }

    let config = ((options) => {
        let fullOptions = {};
        for (let k in DEFAULTS) {
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
    })(options);

    let cache = {}

    let findTemplate = (id) => {
        let scripts = document.getElementsByTagName('script');
        for (let i in scripts) {
            if (scripts[i].type === 'text/doddle-template' && scripts[i].id === id) {
                return scripts[i];
            }
        }

        throw new Error('Could not find template: ' + id + '.');
    }

    this.fromString = (elem, src, vars) => {
        let cacheId = 'str:' + src;
        if (cache[cacheId] === undefined) {
            cache[cacheId] = new Template(
                src,
                config.debug,
                config.delimiters
            );
        }
        elem.innerHTML = cache[cacheId].render(vars);
    }

    this.fromTemplate = (elem, id, vars) => {
        let cacheId = 'tpl:' + id;
        if (cache[cacheId] === undefined) {
            cache[cacheId] = new Template(
                findTemplate(id).innerHTML,
                config.debug,
                config.delimiters
            );
        }
        elem.innerHTML = cache[cacheId].render(vars);
    }
}
