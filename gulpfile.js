const gulp = require('gulp');
const del = require('del');
const browserSync = require('browser-sync');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');
const runSequence = require('run-sequence');

/*    --TOP Level Functions
    gulp.task - define tasks
    gulp.src - point to files to use
    gulp.dest - point to folder output
    gulp.watch - watch files and folders for changes
*/

/*
    Globs starting with ./ wont capture new files
*/

// Set the browser that you want to support
const AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

//delete dist folder
gulp.task('clean', () => del(['dist']) );

//copy php
gulp.task('copyPHP', function(){
    gulp.src('src/**/*.php') //** any file
    .pipe(gulp.dest('dist'));
});

//copy fonts
gulp.task('fonts', function(){
    gulp.src('src/bower_components/font-awesome/fonts/**.*')
    .pipe(gulp.dest('dist/fonts'));
    gulp.src('src/favicon.ico')
    .pipe(gulp.dest('dist/'));
});

//copy + minify html
gulp.task('htmlMin', function(){
    gulp.src('src/**/*.html')
        // .pipe(htmlmin({
        //     collapseWhitespace: true,
        //     removeComments: true,
        //     htmlmin: false,
        // }))
        .pipe(gulp.dest('dist'))
});

//optimize images
gulp.task('imageMin', function(){
    gulp.src('src/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});

// compile sass, concat, minify
gulp.task('sass', function(){
    gulp.src('src/sass/*.scss')
        .pipe(sass({
            outputStyle: 'expanded', //expanded, compact, nested, compressed
            precision: 10,
            includePaths: ['.'],
        }).on('error', sass.logError))
        // Auto-prefix css styles for cross browser compatibility
        .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
        .pipe(concat('main.css'))
        // minify again due to space from concat
        .pipe(csso())
        .pipe(rename({ suffix: '.min'}))
        // browser
        .pipe(browserSync.stream())
        .pipe(gulp.dest('dist/css'));
});

// concat and minify js
gulp.task('scripts', function(){
    gulp.src('src/js/*.js')
        // .pipe(concat('main.js'))
        // .pipe(uglify())
        .pipe(rename({ suffix: '.min'}))
        .pipe(gulp.dest('dist/js'));

    //import jquery to project
    gulp.src('src/bower_components/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('dist/js'));

    //import bootstrap js
    gulp.src('src/bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js')
        .pipe(gulp.dest('dist/js'));    
});

gulp.task('watch', function(){
    browserSync.init({
        server: './dist'
    });

    gulp.watch('src/**/*.html', ['htmlMin']).on('change', browserSync.reload);
    gulp.watch('src/js/*.js', ['scripts']);
    gulp.watch('src/img/*', ['imageMin']);
    gulp.watch('src/sass/*.scss', ['sass']);
    gulp.watch('src/**/*.php', ['copyPHP']);
});

/*
    --Default called during gulp
    runSequence disable parallel execution
*/
gulp.task('default', ['clean'], function (){
    runSequence(
        'copyPHP',
        'fonts',
        'htmlMin',
        'imageMin',
        'sass',
        'scripts',
        'watch'
    );
}); 

// 'copyHTML', 'copyPHP', 'imageMin', 'sass', 'scripts', 'htmlmin']);

//minify js
// gulp.task('minify', function(){
//     gulp.src('src/js/*.js')
//         .pipe(uglify())
//         .pipe(gulp.dest('dist/js'));
// });