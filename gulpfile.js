const gulp = require("gulp");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const cssmin = require("gulp-cssmin");
const babel = require("gulp-babel");

function clean(cb) {
  // gulp.src('public/**/*').pipe(dest('public/'));
  cb();
}

function build() {
  return gulp
    .src("build/**/*")
    .pipe(gulp.dest("public/"));
}

function js() {
  return gulp
    .src("build/js/**/*.js")
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    // .pipe(uglify())
    .pipe(concat("swell-channel-widget-min.js"))
    .pipe(gulp.dest("public/js"));
}

function css() {
  return gulp
    .src("build/css/**/*.css")
    .pipe(concat("swell-channel-widget-min.css"))
    // .pipe(cssmin())
    .pipe(gulp.dest("public/css"));
}

// exports.dev = gulp.series(clean, build, js, css);
// exports.default = gulp.series(clean, build);

exports.dev = function () {
  gulp.watch("build/**/*", { ignoreInitial: false }, gulp.series(build, js, css));
};
