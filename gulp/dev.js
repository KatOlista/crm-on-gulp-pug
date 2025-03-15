import { src, dest, watch } from 'gulp';
import data from 'gulp-data';
import pug from 'gulp-pug';

import * as dartSass from 'sass'
import gulpSass from 'gulp-sass';
import sassGlob from 'gulp-sass-glob-use-forward';
import sourceMaps from 'gulp-sourcemaps';

import newer from 'gulp-newer';
import webp from 'gulp-webp';
import svgSprite from 'gulp-svg-sprite';

import webpack from 'webpack-stream';

import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import clean from 'gulp-clean';
import fs from 'fs';

import prettier from 'gulp-prettier';

import browserSync from 'browser-sync';

import webpackConfig from '../webpack.config.js';

const scss = gulpSass(dartSass);

const plumberNotify = (title) => {
  return {
    errorHandler: notify.onError({
      title,
      message: 'Error <%= error.message %>',
      sound: false,
    })
  }
}

const prettierConfig = {
  singleQuote: true,
  trailingComma: "all",
  tabWidth: 2,
  arrowParens: "avoid",
  semi: true
}

function pugPages() {
  return src(['app/pug/**/*.pug', '!app/pug/components/*.pug', '!app/pug/templates/*.pug'])
    .pipe(newer('app/pug/**/*.pug'))
    .pipe(plumber(plumberNotify('pug')))
    // .pipe(data(function () {
    //   return JSON.parse(fs.readFileSync('app/data/data.json'))
    // }))
    .pipe(pug({
      pretty: true,
      verbose: true,
    }))
    .pipe(dest('dev'))
    .pipe(browserSync.stream())
}

// function pagesDev() {
//   return src(['app/pages/**/*.html', '!app/pages/components/*.html'])
//     .pipe(newer('app/pages/**/*.html'))
//     .pipe(plumber(plumberNotify('HTML')))
//     .pipe(fileInclude({ prefix: '@@', basepath: '@file' }))
//     .pipe(htmlhint())
//     .pipe(dest('dev'))
//     .pipe(browserSync.stream())
// };

function stylesDev() {
  return src(['app/scss/*.scss'])
    .pipe(newer('app/scss/**/*.scss'))
    .pipe(plumber(plumberNotify('Styles')))
    .pipe(sourceMaps.init())
    .pipe(sassGlob())
    .pipe(scss())
    .pipe(sourceMaps.write())
    .pipe(dest('dev/css'))
    .pipe(browserSync.stream())
}

function scriptsDev() {
  return src('app/js/*.js')
    .pipe(newer('app/js/**/*.js'))
    .pipe(plumber(plumberNotify('Script')))
    .pipe(prettier(prettierConfig))
    .pipe(webpack(webpackConfig))
    .pipe(dest('dev/js'))
    .pipe(browserSync.stream())
}

function imagesDev() {
  return src(['app/images/*.*'], { encoding: false })
    .pipe(newer('dev/images'))
    .pipe(webp())
    .pipe(dest('dev/images'))
    .pipe(src(['app/images/*.*', '!app/images/*.svg'], { encoding: false }))
    .pipe(newer('app/images/*.*'))
    .pipe(dest('dev/images'))
    .pipe(browserSync.stream())
}

function spriteDev() {
  return src('app/images/icons/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprite.svg',
          example: true
        }
      }
    }))
    .pipe(dest('dev/images'))
    .pipe(browserSync.stream())
}

function cleanImageStackDev(done) {
  // if (fs.existsSync('app/images/stack')) {
  //   return src(['app/images/stack', 'app/images/sprite.svg'], { read: false })
  //     .pipe(clean())
  // }

  done();
}

function cleanDev(done) {
  if (fs.existsSync('dev')) {
    return src('dev', { read: false })
      .pipe(clean())
  }

  done();
}

function fileDev() {
  return src('app/data/*.*')
    .pipe(dest('dev/data'))
}

function watchingDev() {
  browserSync.init({
    server: {
      baseDir: 'dev/'
    }
  });

  watch(['app/scss/style.scss', 'app/scss/**/*.scss'], stylesDev)
  watch(['app/images'], imagesDev)
  watch(['app/js/*.js'], scriptsDev)

  watch(['app/pug/**/*.pug'], pugPages)
  watch(['app/pug/**/*.pug']).on('change', browserSync.reload)
  // watch(['app/pages/**/*.html'], pagesDev)
  // watch(['app/**/*.html']).on('change', browserSync.reload)
}

export {
  cleanDev,
  cleanImageStackDev,
  // pagesDev,
  stylesDev,
  imagesDev,
  spriteDev,
  scriptsDev,
  watchingDev,
  fileDev,
  pugPages
};
