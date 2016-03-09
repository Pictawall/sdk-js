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

gulp.task('babel', function() {
  return gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('src_es5'));
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

const KarmaServer = require('karma').Server;
gulp.task('test', function (done) {
  new KarmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});
