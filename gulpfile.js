var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');
// doc:https://www.npmjs.com/package/gulp-px3rem
var px2rem = require('gulp-px3rem');
var ngHtml2Js = require("gulp-ng-html2js");
var minifyHtml = require("gulp-minify-html");
var autoprefixer = require('gulp-autoprefixer');


var paths = {
    sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
    gulp.src('./scss/ionic.app.scss')
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(gulp.dest('./www/css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});

gulp.task('install', ['git-check'], function() {
    return bower.commands.install()
        .on('log', function(data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('dev', ['allJs', 'allCss', 'allHtml']);

gulp.task('allJs', function(done) {
    // gulp.src(['./www/src/app/app.js', './www/src/app/services.js', './www/src/*/**/*.js'])
    //     .pipe(sourcemaps.init())
    //     .pipe(concat('all.js'))
    //     .pipe(rename({ suffix: '.min' }))   //rename压缩后的文件
    //     .pipe(ngAnnotate({ add: true }))
    //     .pipe(uglify())
    //     .pipe(sourcemaps.write())
    //     .pipe(gulp.dest('./www/dist/'))
    //     .on('end', done);

    gulp.src(['./www/src/app/app.js', './www/src/app/services.js', './www/src/*/**/*.js', './www/config.js'])
        .pipe(ngAnnotate({ add: true }))
        .pipe(sourcemaps.init())
        .pipe(concat('all.js'))
        // .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./www/dist/'))
        .on('end', done);
});

gulp.task('px2rem', function(done) {
    gulp.src('./www/src/**/*.rem.css')
        .pipe(px2rem())
        .pipe(gulp.dest('./www/src/_rem_css/'))
        .on('end', done);
});

gulp.task('allCss', ['px2rem'], function(done) {
    gulp.src(['./www/src/**/*.css', '!./www/src/**/*.rem.css'])
        .pipe(concat('all.css'))
        .pipe(rename({ suffix: '.min' })) //rename压缩后的文件
        .pipe(autoprefixer({
            browsers: ['IOS >= 8', 'Android >= 4.2'],
            cascade: true,
            remove: true
        }))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(gulp.dest('./www/dist/'))
        .on('end', done);
});

gulp.task('allHtml', function(done) {
    gulp.src("./www/src/**/*.html")
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(ngHtml2Js({
            moduleName: "templates",
            prefix: "src/"
        }))
        .pipe(concat("templates.js"))
        .pipe(uglify())
        .pipe(gulp.dest("./www/dist/"))
        .on('end', done);
});

gulp.task('watch', ['sass'], function() {
    // gulp.watch('./www/src/*/**/*.js', ['allJs']);
    // gulp.watch('./www/src/**/*.css', ['allCss']);
    gulp.start('allJs');
    gulp.start('allCss');
    gulp.start('allHtml');
    watch('./www/src/*/**/*.js', function() {
        gulp.start('allJs');
    });
    watch('./www/src/**/*.css', function() {
        gulp.start('allCss');
    });
    watch('./www/src/**/*.html', function() {
        gulp.start('allHtml');
    })
})

gulp.task('minJS', function(done) {
    gulp.src('./www/lib/ionic/js/ionic.bundle.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./www/lib/ionic/js/'))
        .on('end', done);
})

;