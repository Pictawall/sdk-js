'use strict';

const gulp = require('gulp');

gulp.task('refresh-example', function () {
  gulp.src('./dist/**/*')
    .pipe(browserSync.reload({ stream: true }))
    .on('error', handleError);
});

const webpack = require('webpack');
gulp.task('dist', function (callback) {

  webpack(require('./webpack.config'), function (err, stats) {
    if (err) {
      handleError(err);
    } else {
      console.log('[webpack]', stats.toString());
    }

    callback();
  });
});

const jsdoc = require('gulp-jsdoc3');
gulp.task('jsdoc', function () {
  gulp.src('./src/js/**/*.js')
    .pipe(jsdoc({
      opts: {
        destination: './docs'
      }
    }));
});

/**
 * Function for handing error
 */
function handleError(error) {
  console.error(error);
  this.emit('end');
}
