/* jshint node: true */
'use strict';

// TODO: introduce watchify to the browserify build to to operate on changed files only.
// TODO: introduce livereload to the build process
// TODO: introduce minifying images to the build process
// TODO: introduce testing js to the build process
// TODO: add the build task logic for building the app for production
// TODO: introduce jshint to the build process of the js

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');

const del = require('del');
const glob = require('glob');
const runSequence = require('run-sequence');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const flatten = require('gulp-flatten');
const bower = require('gulp-bower');
const livereload = require('gulp-livereload');
const gutil = require('gulp-util');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const uglify = require('gulp-uglify');
const browserify = require('browserify');
const babelify = require("babelify");
const watchify = require('watchify');

// const imagemin = require('gulp-imagemin');
// const pngquant = require('imagemin-pngquant');


gulp.task('bower', function() {
    return bower('public/vendor/');
});

gulp.task('clean', function() {
    // nothing for now
});

gulp.task('imgs', () => {
    // nothing for now
});

gulp.task('css', () => {
    return gulp.src('./styles/**/*.scss')
        .pipe(sourcemaps.init())
            .pipe(flatten())
            .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('js', () => {
    let filesObj = glob.sync('./scripts/*.js');
    return Promise.all(filesObj.map(filename => {
        return new Promise((resolve, reject) => {
            let fileStream = browserify(filename, { debug: true })
            .transform(babelify)
            .bundle()
            .on('error', gutil.log.bind(gutil, 'Browserify Error'))

            .pipe(source(filename))
            .pipe(buffer())

            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(flatten())
            // .pipe(uglify().on('error', gutil.log))
            .pipe(rename({ extname: '.min.js'}))
            .pipe(sourcemaps.write('./'))

            .pipe(gulp.dest('./public/js'));
            fileStream.on('end', () => { resolve(); });
            fileStream.on('error', err => { gutil.log(err); reject(err); });
        });
    }));
});

gulp.task('test', () => {
    // nothing for now
});

gulp.task('develop', () => {
    gulp.watch('./styles/**/*.scss', ['css']);
    gulp.watch('./scripts/**/*.js', ['js']);
});

gulp.task('default', (cb) => {
    gulp.task('_log', (cb) => {
        console.log('');
        console.log(gutil.colors.bgGreen.bold('                              '));
        console.log(gutil.colors.bgGreen.bold('  Project built successfully  '));
        console.log(gutil.colors.bgGreen.bold('                              '));
        console.log('');
        cb();
    });
    runSequence('bower', ['css', 'js', 'imgs', 'test'], '_log', cb);
});

gulp.task('build', () => {
    // nothing for now
    // console.log('');
    // console.log(gutil.colors.bgMagenta.bold('                               '));
    // console.log(gutil.colors.bgMagenta.bold('  Production build successful  '));
    // console.log(gutil.colors.bgMagenta.bold('                               '));
    // console.log('');
});

