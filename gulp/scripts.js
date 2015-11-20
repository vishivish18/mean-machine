var gulp   = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var ngAnnotate = require('gulp-ng-annotate')
var sourcemaps = require('gulp-sourcemaps')

gulp.task('js', function () {
  return gulp.src(['public/app/controllers/module.js', 'public/app/controllers/**/*.js'])
    .pipe(sourcemaps.init())
      .pipe(concat('app.js'))
      //.pipe(ngAnnotate())  /* ngAnnotate  is causing trouble sunddenly , so skipping uglifying for a while
      //.pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/assets'))
})

gulp.task('watch:js', ['js'], function () {
  gulp.watch('ng/**/*.js', ['js'])
})