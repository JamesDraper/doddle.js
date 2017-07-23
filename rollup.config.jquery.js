import babel from 'rollup-plugin-babel';

export default {
    entry: 'jquery.index.js',
    dest: 'dist/jquery.doddle.js',
    format: 'iife',
    useStrict: false,
    plugins: [ babel() ]
};
