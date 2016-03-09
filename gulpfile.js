'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');

const webpack = require('webpack');
gulp.task('dist', function (callback) {

  webpack(require('./webpack.config'), function (err, stats) {
    if (err) {
      console.error(err);
    } else {
      console.log('[webpack]', stats.toString());
    }

    callback();
  });
});

gulp.task('es5-copy-nonjs', function () {
  return gulp
    .src(['src/**/*', 'tests/**/*', '!**/*.js'], { base: '.' })
    .pipe(gulp.dest('./es5'));
});

gulp.task('es5', ['es5-copy-nonjs'], function () {
  return gulp.src(['src/**/*.js', 'tests/**/*.js'], { base: '.' })
    .pipe(babel())
    .pipe(gulp.dest('./es5'));
});

const jsdoc = require('gulp-jsdoc3');
gulp.task('jsdoc', function () {
  gulp.src('./src/**/*.js')
    .pipe(jsdoc({
      opts: {
        destination: './docs'
      }
    }));
});
