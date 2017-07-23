import babel from 'rollup-plugin-babel';

export default {
    entry: 'index.js',
    dest: 'dist/doddle.js',
    format: 'iife',
    useStrict: false,
    plugins: [ babel() ]
};
