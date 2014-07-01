var gulp = require('gulp')
var gutil = require('gulp-util');
var coffee = require('gulp-coffee')
var sourcemaps = require('../../gulp-sourcemaps/index.js'); // git@github.com:GiantThinkwell/gulp-sourcemaps.git

gulp.src('gulped/include/*.coffee')
  .pipe(sourcemaps.init())
  .pipe(coffee()).on('error', gutil.log)
  .pipe(sourcemaps.write('.', { sourceRoot: '', includeContent: false }))
  .pipe(gulp.dest('gulped/include'));
