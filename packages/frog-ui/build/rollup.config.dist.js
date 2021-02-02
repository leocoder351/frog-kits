const resolve = require('@rollup/plugin-node-resolve');
const { babel } = require('@rollup/plugin-babel');
const peerDepsExternal = require('rollup-plugin-peer-deps-external');
const commonjs = require('@rollup/plugin-commonjs');
const { terser } = require('rollup-plugin-terser');
const image = require('@rollup/plugin-image');
const { DIST_DIR, DIST_NAME } = require('./constant');

module.exports = {
  input: 'components/index.tsx',
  output: {
    name: 'Frog',
    file: `${DIST_DIR}/${DIST_NAME}.js`,
    format: 'umd',
    sourcemap: true,
    globals: {
      'react': 'React',
      'react-dom': 'ReactDOM'
    }
  },
  plugins: [
    peerDepsExternal(),
    commonjs({
      include: ['node_modules/**', '../../node_modules/**'],
      namedExports: {
        'react-is': ['isForwardRef', 'isValidElementType'],
      }
    }),
    resolve({
      extensions: ['.tsx', '.ts', '.js'],
      jsnext: true,
      main: true,
      browser: true
    }),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx', 'ts', 'tsx']
    }),
    image()
  ]
}
