 
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    pump = require('pump'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require("gulp-rename"),
    imagemin = require('gulp-imagemin'),
    cleanCSS = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    cssBase64 = require('gulp-css-base64'),
    shorthand = require('gulp-shorthand');


// Paths 

var paths = {
    js: 'js/*.js',
    images: 'img/*',
    sass: 'sass/*.scss',
    css: 'css/*.css',
    base64: 'base64/*.css'
};

// Sass
gulp.task('sass', function() {
    var prefixerOptions = { browsers: ['last 2 version', 'safari 5', 'opera 12.1', 'ios 6', 'android 4', '> 10%'] };
    return gulp.src(paths.sass)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('css'));
});

// Compress JavaScript Files
gulp.task('compressjs', function(cb) {
    pump([
            gulp.src(paths.js),
            uglify(),
            rename({ suffix: '.min' }),
            gulp.dest('dest/minjs')
        ],
        cb
    );
});

// Compress Css File
gulp.task('minify-css', function() {
    return gulp.src(paths.base64)
        .pipe(cleanCSS({ compatibility: 'ie8', processImport: false }))
        .pipe(shorthand())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dest/mincss'));
});

// encode image to data URI
// skip /*base64:skip*/ 
gulp.task('base64', function() {
    return gulp.src(paths.css)
        .pipe(cssBase64())
        .pipe(gulp.dest('base64'));
});
// Minify PNG, JPEG, GIF and SVG images
gulp.task('imgmin', function () {
     return gulp.src(paths.images)
         .pipe(imagemin())
         .pipe(gulp.dest('images'));
});


// Rerun the task when a file changes 'sass' ,'base64'
var watchstyle = gulp.watch(paths.sass);
watchstyle.on('all', function(event, path, stats) {
    console.log('File ' + path + ' was ' + event + ', running tasks...');
    gulp.watch(paths.sass, gulp.parallel('sass'));
});

// Task Default
gulp.task('default', gulp.parallel('compressjs','imgmin', 'minify-css','base64'));

