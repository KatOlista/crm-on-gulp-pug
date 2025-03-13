import { src, dest } from 'gulp';

import fileInclude from 'gulp-file-include';
import htmlhint from 'gulp-htmlhint';
import htmlmin from 'gulp-htmlmin';
import webphtml from 'gulp-webp-html';

import * as dartSass from 'sass'
import gulpSass from 'gulp-sass';
import sassGlob from 'gulp-sass-glob-use-forward';
import autoprefixer from 'gulp-autoprefixer';
import groupMedia from 'gulp-group-css-media-queries';
import csso from 'gulp-csso';

import imagemin from 'gulp-imagemin';
import newer from 'gulp-newer';
import webp from 'gulp-webp';
import svgSprite from 'gulp-svg-sprite';

import webpack from 'webpack-stream';
import babel from 'gulp-babel';

import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import clean from 'gulp-clean';
import fs from 'fs';

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

function pages() {
  return src(['app/pages/**/*.html', '!app/pages/components/*.html'])
    .pipe(newer('app/pages/**/*.html'))
    .pipe(plumber(plumberNotify('HTML')))
    .pipe(fileInclude({ prefix: '@@', basepath: '@file' }))
    .pipe(webphtml())
    .pipe(htmlhint())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
};

function styles() {
  return src(['app/scss/*.scss'])
    .pipe(newer('app/scss/*.scss'))
    .pipe(plumber(plumberNotify('Styles')))
    .pipe(sassGlob())
    .pipe(scss())
    .pipe(autoprefixer())
    .pipe(groupMedia())
    .pipe(csso())
    // .pipe(scss({ style: 'compressed' }))
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream())
}

function scripts() {
  return src('app/js/*.js')
    .pipe(newer('app/js/**/*.js'))
    .pipe(plumber(plumberNotify('Script')))
    .pipe(babel())
    .pipe(webpack(webpackConfig))
    .pipe(dest('dist/js'))
    .pipe(browserSync.stream())
}

function images() {
  return src(['app/images/*.*', '!app/images/*.svg'], { encoding: false })
    .pipe(newer('app/images/*.*'))
    .pipe(webp())
    .pipe(dest('dist/images'))
    .pipe(src(['app/images/*.*', '!app/images/*.svg'], { encoding: false }))
    .pipe(newer('app/images/*.*'))
    .pipe(imagemin({ verbose: true }))
    .pipe(dest('dist/images'))
    .pipe(browserSync.stream())
}

function sprite() {
  return src('app/images/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprite.svg',
          example: true
        }
      }
    }))
    .pipe(dest('app/images'))
    .pipe(browserSync.stream())
}

function getSprite() {
  return src('app/images/sprite.svg')
    .pipe(dest('dist/images'))
}

function cleanDist(done) {
  if (fs.existsSync('dist')) {
    return src('dist', { read: false })
      .pipe(clean())
  }

  done();
}

function file() {
  return src('app/data/*.*')
    .pipe(dest('dist/data'))
}

function cleanImageStack(done) {
  if (fs.existsSync('app/images/stack')) {
    return src(['app/images/stack', 'app/images/sprite.svg'], { read: false })
      .pipe(clean())
  }

  done();
}

function server() {
  browserSync.init({
    server: {
      baseDir: 'dist/'
    }
  });
}

export {
  cleanDist,
  cleanImageStack,
  pages,
  styles,
  images,
  sprite,
  scripts,
  getSprite,
  file,
  server
};

