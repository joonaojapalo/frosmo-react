const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');
const { uglify } = require('rollup-plugin-uglify');

const getPlugins = ({env}) => [
    replace({
         __DEV__: env === 'production' ? false : true
    }),
    babel({
        exclude: './node_modules/**',
    }),
    resolve({
        customResolveOptions: {
            moduleDirectory: 'node_modules',
        },
    }),
    uglify(),
];

const CJSBuild = [
    {
        input: './src/index.js',
        output: {
            file: './dist/index.development.js',
            sourcemap: 'inline',
            format: 'cjs',
            compact: true,
        },
        plugins: getPlugins({env: 'development'}),
        external: ['react', 'prop-types', 'object-assign'],
    },
    {
        input: './src/index.js',
        output: {
            file: './dist/index.production.min.js',
            format: 'cjs',
            compact: true,
        },
        plugins: getPlugins({env: 'production'}),
        external: ['react', 'prop-types', 'object-assign'],
    }
];

module.exports = CJSBuild;
