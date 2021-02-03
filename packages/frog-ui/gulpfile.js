const { src, dest, series } = require('gulp');
const path = require('path');
const { readFileSync } = require('fs');
const rollup = require('rollup');
const babel = require('gulp-babel');
const through2 = require('through2');
const rename = require('gulp-rename');
const less = require('less');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const NpmImportPlugin = require('less-plugin-npm-import');
const uglifycss = require('gulp-uglifycss');
const concat = require('gulp-concat');
const { terser } = require('rollup-plugin-terser');
const rollupConfig = require('./build/rollup.config.dist');
const { DIST_DIR, DIST_NAME } = require('./build/constant');

const { ENV_ES = 'false' } = process.env;
const LIB_DIR = 'lib';
const ES_DIR = 'es';

function _compileJS() {
  return src(['components/**/*.{tsx, ts, js}', '!components/**/__tests__/*.{tsx, ts, js}'])
    .pipe(
      babel({
        presets: [
          [
            '@babel/preset-env',
            {
              modules: ENV_ES === 'true' ? false : 'commonjs',
            },
          ],
        ],
      }),
    )
    .pipe(dest(ENV_ES === 'true' ? ES_DIR : LIB_DIR));
}

function _transformLess(lessFile, config = {}) {
  const { cwd = process.cwd() } = config;
  const resolvedLessFile = path.resolve(cwd, lessFile);

  let data = readFileSync(resolvedLessFile, 'utf-8');
  data = data.replace(/^\uFEFF/, '');

  const lessOption = {
    paths: [path.dirname(resolvedLessFile)],
    filename: resolvedLessFile,
    plugins: [new NpmImportPlugin({ prefix: '~' })],
    javascriptEnabled: true,
  };

  return less
    .render(data, lessOption)
    .then(result => postcss([autoprefixer]).process(result.css, { from: undefined }))
    .then(r => r.css);
}

function _compileLess() {
  return src('components/**/*.less')
    .pipe(
      through2.obj(function (file, encoding, next) {
        this.push(file.clone());
        if (
          // 编译 style/index.less 为 .css
          file.path.match(/(\/|\\)style(\/|\\)index\.less$/)
        ) {
          _transformLess(file.path)
            .then(css => {
              file.contents = Buffer.from(css);
              file.path = file.path.replace(/\.less$/, '.css');
              this.push(file);
              next();
            })
            .catch(e => {
              console.error(e);
            });
        } else {
          next();
        }
      }),
    )
    .pipe(dest(ENV_ES === 'true' ? ES_DIR : LIB_DIR));
}

function _copyLess() {
  return src('components/**/*.less').pipe(dest(ENV_ES === 'true' ? ES_DIR : LIB_DIR));
}

function _copyImage() {
  return src('components/**/*.@(jpg|jpeg|png|svg)').pipe(
    dest(ENV_ES === 'true' ? ES_DIR : LIB_DIR),
  );
}

function _compileDistCSS() {
  return src('components/**/*.less')
    .pipe(
      through2.obj(function (file, encoding, next) {
        if (
          // 编译 style/index.less 为 .css
          file.path.match(/(\/|\\)style(\/|\\)index\.less$/)
        ) {
          _transformLess(file.path)
            .then(css => {
              file.contents = Buffer.from(css);
              file.path = file.path.replace(/\.less$/, '.css');
              this.push(file);
              next();
            })
            .catch(e => {
              console.error(e);
            });
        } else {
          next();
        }
      }),
    )
    .pipe(concat(`./${DIST_NAME}.css`))
    .pipe(dest(DIST_DIR))
    .pipe(uglifycss())
    .pipe(rename(`./${DIST_NAME}.min.css`))
    .pipe(dest(DIST_DIR));
}

async function _compileDistJS() {
  const inputOptions = rollupConfig;
  const outputOptions = rollupConfig.output;

  // 打包 frog.js
  const bundle = await rollup.rollup(inputOptions);
  await bundle.generate(outputOptions);
  await bundle.write(outputOptions);

  // 打包 frog.min.js
  inputOptions.plugins.push(terser());
  outputOptions.file = `${DIST_DIR}/${DIST_NAME}.min.js`;

  const bundleUglify = await rollup.rollup(inputOptions);
  await bundleUglify.generate(outputOptions);
  await bundleUglify.write(outputOptions);
}

exports.compileDistTask = series(_compileDistJS, _compileDistCSS);
exports.default = series(_compileJS, _copyLess, _copyImage);
