var gulp = require('gulp')
var gutil = require('gulp-util');
var coffee = require('gulp-coffee')
var sourcemaps = require('../../gulp-sourcemaps/index.js'); // git@github.com:GiantThinkwell/gulp-sourcemaps.git

// compile maps to gulped/maps
gulp.src('gulped/include/*.coffee')
  .pipe(sourcemaps.init())
  .pipe(coffee({ bare: true })).on('error', gutil.log)
  .pipe(sourcemaps.write('../maps', { 
    sourceRoot: '../include', 
    includeContent: false 
  }))
  .pipe(gulp.dest('gulped/include/*.temp.js'));
