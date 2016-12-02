var gulp = require('gulp');
var rev = require('gulp-rev');
var uglify = require('gulp-uglify')
var browserify = require('browserify');
var babelify = require('babelify');
var path = require('path');
var through2 = require('through2');
var gutil = require('gulp-util');
var lazypipe = require('lazypipe');


var getBsfy = function (opts) {
  return through2.obj(function (file, enc, next) {
    browserify(file.path, { debug: opts.debug })
      .transform(babelify, {
        sourceMaps: opts.debug,
        presets: ['es2015', 'react'],
        plugins: ['transform-class-properties']
      })
      .bundle(function (err, res) {

        if (!err) {
          file.contents = res;
          next(err, file);
          return
        }

        gutil.log(
          gutil.colors.red("Browserify compile error:"), "\n", 
          err.message, "\n", 
          err.codeFrame);
        
        process.exit(1);
      });
  });
};

var revAndDest = lazypipe()
  .pipe(rev)
  .pipe(gulp.dest, 'dest')
  .pipe(rev.manifest)
  .pipe(gulp.dest, 'src');

gulp.task('js:dev', function () {
  return gulp.src(['src/*.js'])
    .pipe(getBsfy({ debug: true }))
    .pipe(revAndDest())
});

gulp.task('js:prod', function () {
  return gulp.src(['src/*.js'])
    .pipe(getBsfy({ debug: false }))
    .pipe(uglify())
    .pipe(revAndDest())
});