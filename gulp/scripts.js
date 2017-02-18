var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var ngAnnotate = require('gulp-ng-annotate')
var sourcemaps = require('gulp-sourcemaps')

gulp.task('js', function() {    
    return gulp.src(['public/app/controllers/module.js', 'public/app/**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        //.pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/assets'))
})

gulp.task('watch:js', ['js'], function() {
    gulp.watch('ng/**/*.js', ['js'])
})
