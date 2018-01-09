var gulp = require('gulp');
var sass = require('gulp-sass');
var group = require('gulp-group-files');
var postcss = require('gulp-postcss');
var autoprefixer = require('gulp-autoprefixer');
var del = require('del');


var sassFiles = {
  "blue": {
    src: "./originVariable/blue/flat_left_menu.scss",
    dest: "../../dist/iov-web-skins/blue/theme"
  },
  "blue01": {
    src: "./originVariable/blue/style.scss",
    dest: "../../dist/iov-web-skins/blue/"
  },
  "blue02": {
    src: "./originVariable/blue/3level_left_tree.scss",
    dest: "../../dist/iov-web-skins/blue/theme"
  },
  "blue-white": {
    src: "./originVariable/blue-white/flat_left_menu.scss",
    dest: "../../dist/iov-web-skins/blue-white/theme"
  },
  "blue-white01": {
    src: "./originVariable/blue-white/style.scss",
    dest: "../../dist/iov-web-skins/blue-white"
  },
  "blue-white02": {
    src: "./originVariable/blue-white/3level_left_tree.scss",
    dest: "../../dist/iov-web-skins/blue-white/theme"
  },

  "deep-grey": {
    src: "./originVariable/deep-grey/flat_left_menu.scss",
    dest: "../../dist/iov-web-skins/deep-grey/theme"
  },
  "deep-grey01": {
    src: "./originVariable/deep-grey/style.scss",
    dest: "../../dist/iov-web-skins/deep-grey"
  },
  "deep-grey02": {
    src: "./originVariable/deep-grey/3level_left_tree.scss",
    dest: "../../dist/iov-web-skins/deep-grey/theme"
  },

  "light-blue": {
    src: "./originVariable/light-blue/flat_left_menu.scss",
    dest: "../../dist/iov-web-skins/light-blue/theme"
  },
  "light-blue01": {
    src: "./originVariable/light-blue/style.scss",
    dest: "../../dist/iov-web-skins/light-blue"
  },
  "light-blue02": {
    src: "./originVariable/light-blue/3level_left_tree.scss",
    dest: "../../dist/iov-web-skins/light-blue/theme"
  },

  "light-green": {
    src: "./originVariable/light-green/flat_left_menu.scss",
    dest: "../../dist/iov-web-skins/light-green/theme"
  },
  "light-green01": {
    src: "./originVariable/light-green/style.scss",
    dest: "../../dist/iov-web-skins/light-green"
  },
  "light-green02": {
    src: "./originVariable/light-green/3level_left_tree.scss",
    dest: "../../dist/iov-web-skins/light-green/theme"
  },
};

gulp.task('sass', ["del"], function() {
  return group(sassFiles, function(key, fileset) {
      return gulp.src(fileset.src)
          .pipe(sass({
            outputStyle: "expanded"
          }).on('error', sass.logError))
          .pipe(autoprefixer(["last 4 versions","Firefox >= 20","ie >= 9"]))
          .pipe(gulp.dest(fileset.dest));
  })();
});


gulp.task('others', ["del"], function() {
  return gulp.src(['./const/**/*'])
    .pipe(gulp.dest('../../dist/iov-web-skins/blue'))
    .pipe(gulp.dest('../../dist/iov-web-skins/blue-white'))
    .pipe(gulp.dest('../../dist/iov-web-skins/deep-grey'))
    .pipe(gulp.dest('../../dist/iov-web-skins/light-blue'))
    .pipe(gulp.dest('../../dist/iov-web-skins/light-green'))
});


gulp.task('del', function() {
    del('../../dist/iov-web-skins/**/*')
});

gulp.task('default', ['sass', 'others']);