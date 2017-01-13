var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    kraken       = require('gulp-kraken'),
    rename       = require('gulp-rename'),
    imagemin     = require('gulp-imagemin'),
    uglify       = require('gulp-uglify'),
    concat       = require('gulp-concat'),
    pngquant     = require('imagemin-pngquant');

gulp.task('generate_styles', function(){

    gulp.src('scss/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer('last 10 versions', 'ie 9'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./css/'))
        .pipe(notify('SASS Compiled and Prefixed'));

    gulp.src('scss/**/*.scss')
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer('last 10 versions', 'ie 9'))
        .pipe(rename({
            suffix: '.full'
        }))
        .pipe(gulp.dest('./css/'))
        .pipe(notify('SASS Compiled, Prefixed and Minified'));

});

gulp.task('compress_javascript', function() {

  gulp.src('js/*.js')
    .pipe(uglify())
    .pipe(concat('app.js'))
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest('./js/'))
    .pipe(notify('Javascript Minified and Concatenated'));

});

gulp.task('minify_images', function() {

    return gulp.src('img/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./img/'))
        .pipe(notify('Images Compressed'));

});

gulp.task('watch_build', function() {
    gulp.watch('scss/**/*.scss', ['generate_styles']);
    gulp.watch('js/**/*.js', ['generate_styles']);
});
