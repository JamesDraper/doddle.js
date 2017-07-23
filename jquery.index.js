import Doddle from './src/Doddle.js';

$.fn.doddle = (() => {
    let doddle = new Doddle();

    let filterOptions = (options) => {
        options.tplId  = undefined;
        options.tplStr = undefined;
        options.vars   = undefined;
        return options;
    }

    return function (options = {}) {

        if ((options.tplId === undefined && options.tplStr === undefined) || (options.tplId !== undefined && options.tplStr !== undefined)) {
            throw new Error('Either tplStr or tplId must passed as doddle plugin options.');
        }

        if (options.tplId !== undefined) {
            doddle.fromTemplate(this[0], options.tplId, options.vars, filterOptions(options));
        } else {
            doddle.fromString(this[0], options.tplStr, options.vars, filterOptions(options));
        }
    }
})();
