let fs = require("fs");

let gulp = require('gulp-param')(require('gulp'), process.argv);
let browserSync = require("browser-sync");
let LessAutoprefix = require('less-plugin-autoprefix');
let autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });
let del = require('del');

let cleanCSS = require('gulp-clean-css');
let gutil = require('gulp-util');
let less = require('gulp-less');
let uglify = require('gulp-uglify');
let rev = require('gulp-rev');
let revCollector = require('gulp-rev-collector');
let useref = require('gulp-useref');
let gulpif = require('gulp-if');
let revdel = require('gulp-rev-delete-original');
const eslint = require('gulp-eslint');
// let imagemin = require('gulp-imagemin');


const gulpEmptyTask = function() {
  return new Promise((resolve) => {
    resolve();
  });
};

const config = {
  cdnDomains: [""]
};

gulp.task('default', function() {
  // 将你的默认的任务代码放在这
  console.info("Hello!");
});

gulp.task("init-config", function(s, nocdn) {
  // if (nocdn === 1) {
    config.cdnDomains = [""];
  // } else {
    // config.cdnDomains = [`/${s}/`];
  // }

  return new Promise((resolve) => {
    resolve();
  });
});

gulp.task("build-clean", ["init-config"], function(s) {
  const destDir = `${__dirname}/dist/${s}/**`;
  return del([destDir]);
});


gulp.task("rev-collector-html", ["rev"], function(s) {
  const destDir = `${__dirname}/dist/${s}`;
  const revDir = `${__dirname}/dist/${s}/rev`;
  return gulp.src([`${revDir}/**/*.json`, `${destDir}/*.html`])
    .pipe(revCollector({
      replaceReved: false,
      dirReplacements: {
        'css/': `${config.cdnDomains[0]}css`,
        'js/': `${config.cdnDomains[0]}js`,
        "assets/": `${config.cdnDomains[0]}assets`
      }
    }))
    .pipe(gulp.dest(`${destDir}/`));
});


gulp.task("rev-collector-js", ["rev"], function(s) {
  const destDir = `${__dirname}/dist/${s}`;
  const revDir = `${__dirname}/dist/${s}/rev`;
  return gulp.src([`${revDir}/**/*.json`, `${destDir}/js/*.js`])
    .pipe(revCollector({
      replaceReved: true,
      dirReplacements: {
        'css/': `${config.cdnDomains[0]}css`,
        'js/': `${config.cdnDomains[0]}js`,
        "assets/": `${config.cdnDomains[0]}assets`
      }
    }))
    .pipe(gulp.dest(`${destDir}/js/`));
});


gulp.task("rev-collector-css", ["rev"], function(s) {
  const destDir = `${__dirname}/dist/${s}`;
  const revDir = `${__dirname}/dist/${s}/rev`;
  return gulp.src([`${revDir}/**/*.json`, `${destDir}/css/*.css`])
    .pipe(revCollector({
      replaceReved: false,
      dirReplacements: {
        "assets/": `${config.cdnDomains[0] === "" ? "../" : config.cdnDomains[0]}assets`,
        "../assets/": `${config.cdnDomains[0] === "" ? "../" : config.cdnDomains[0]}assets`,
      }
    }))
    .pipe(gulp.dest(`${destDir}/css/`));
});

gulp.task("rev-collector-assets-json", ["rev"], function(s) {
  const destDir = `${__dirname}/dist/${s}`;
  const revDir = `${__dirname}/dist/${s}/rev`;
  return gulp.src([`${revDir}/**/*.json`, `${destDir}/assets/json/*.json`])
    .pipe(revCollector({
      replaceReved: false,
      dirReplacements: {
        "assets/": `${config.cdnDomains[0] === "" ? "../" : config.cdnDomains[0]}assets`,
        "../assets/": `${config.cdnDomains[0] === "" ? "../" : config.cdnDomains[0]}assets`,
      }
    }))
    .pipe(gulp.dest(`${destDir}/assets/json/`));
});

gulp.task("rev-assets", ["build-clean"], function(s) {
  const rootDir = `${__dirname}/app/${s}/assets`;
  const destDir = `${__dirname}/dist/${s}/assets`;
  const revDir = `${__dirname}/dist/${s}/rev/assets`;
  return gulp.src(`${rootDir}/**`)
    .pipe(rev())
    .pipe(gulp.dest(`${destDir}/`))
    .pipe(rev.manifest({ merge: true }))
    .pipe(gulp.dest(`${revDir}/`));
});

gulp.task("rev-css", ["useref"], function(s) {
  const destDir = `${__dirname}/dist/${s}/css`;
  const revDir = `${__dirname}/dist/${s}/rev/css`;

  return gulp.src(`${destDir}/*.css`)
    .pipe(rev())
    .pipe(revdel())
    .pipe(gulp.dest(`${destDir}/`))
    .pipe(rev.manifest({ merge: true }))
    .pipe(gulp.dest(`${revDir}/`));
});

gulp.task("rev-js", ["useref"], function(s) {
  const destDir = `${__dirname}/dist/${s}/js`;
  const revDir = `${__dirname}/dist/${s}/rev/js`;
  return gulp.src([`${destDir}/*.js`])
    .pipe(rev())
    .pipe(revdel())
    .pipe(gulp.dest(`${destDir}/`))
    .pipe(rev.manifest({ merge: true }))
    .pipe(gulp.dest(`${revDir}/`));
});

gulp.task("useref", ["build-clean", "basecss"], function(s) {
  const rootDir = `${__dirname}/app/${s}`;
  const destDir = `${__dirname}/dist/${s}`;

  return gulp.src(`${rootDir}/*.html`)
    .pipe(useref())
    .pipe(gulpif('*.js', uglify({ compress: true })))
    .pipe(gulpif('*.css', less({
      plugins: []
    })))
    .pipe(gulpif('*.css', cleanCSS({ keepSpecialComments: 0 })))
    .pipe(gulp.dest(`${destDir}/`));
});

gulp.task("del-base-css", function() {
  return del(["app/common/css/base.css"]);
});

gulp.task("basecss", ["del-base-css"], function() {
  return gulp.src(`app/common/less/base.less`)
    .pipe(less({
      plugins: [autoprefix]
    }))
    .pipe(gulp.dest(`app/common/css/`));
});

gulp.task("eshint", function(s) {
  const rootDir = `${__dirname}/app`;
  const appDir = `${__dirname}/app/${s}`;

  let start_eslint = function(_excludes) {
    _excludes = _excludes.map(_path => {
      return `!${appDir}/${_path}`;
    });

    return gulp.src([
        `${rootDir}/../gulpfile.js`,
        `${rootDir}/common/js/base.js`,
        `${rootDir}/common/js/mobile_orientation.js`,
        `${appDir}/**/*.js`
      ].concat(_excludes))
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
  };

  let p = new Promise((resolve, reject) => {
    fs.readFile(`${appDir}/.eslintrc`, (err, file) => {
      let _config = [];
      if (!err) {
        try {
          _config = JSON.parse(file.toString()).excludes || [];
        } catch (ex) {
          gutil.log(gutil.colors.red(`ERROR: parse "${appDir}/.eslintrc" failed.`));
          gutil.log(gutil.colors.red(ex.message));
          reject();
          return;
        }
      }
      resolve(start_eslint(_config));
    });

  });

  return p;
});
gulp.task("rev", ["rev-js", "rev-css", "rev-assets", "useref"], gulpEmptyTask);
gulp.task("rev-collector", ["rev-collector-html", "rev-collector-css", "rev-collector-js", "rev-collector-assets-json"], gulpEmptyTask);
gulp.task("build", ["build-clean", "rev-collector"], gulpEmptyTask);
gulp.task("build-test", ["build"], function(s) {
  let options = {
    port: 9002,
    ghostMode: {
      clicks: false,
      location: false,
      forms: false,
      scroll: true
    },
    injectChanges: true,
    logFileChanges: true,
    logLevel: 'debug',
    logPrefix: 'gulp-patterns',
    notify: true,
    reloadDelay: 0, //1000,
    online: false,
    server: {
      baseDir: [`dist/${s}`]
    },
    files: ["dist/${s}/**/*.*"]
  };
  browserSync(options);
});
gulp.task("build-test-s", ["build"], function(s) {
  let options = {
    port: 9002,
    ghostMode: {
      clicks: false,
      location: false,
      forms: false,
      scroll: true
    },
    injectChanges: true,
    logFileChanges: true,
    logLevel: 'debug',
    logPrefix: 'gulp-patterns',
    notify: true,
    reloadDelay: 0, //1000,
    online: false,
    server: {
      baseDir: [`dist/${s}`]
    },
    files: ["dist/${s}/**/*.*"]
  };
  browserSync(options);
});
gulp.task("start", function() {
  let options = {
    port: 9001,
    ghostMode: {
      clicks: false,
      location: false,
      forms: false,
      scroll: true
    },
    injectChanges: true,
    logFileChanges: true,
    logLevel: 'debug',
    logPrefix: 'gulp-patterns',
    notify: true,
    reloadDelay: 0, //1000,
    online: false,
    server: {
      baseDir: ["app"]
    },
    files: ["app/**/*.*"]
  };
  browserSync(options);
});
gulp.task("new", function(name) {
  if (!name) return gutil.log(gutil.colors.red("ERROR: need a name for new dir."));

  return new Promise(function(resolve) {
    fs.access(__dirname + "/app/" + name, (err) => {
      if (err) {
        gulp.src("app/_template/**/*").pipe(gulp.dest("app/" + name));
        gutil.log(gutil.colors.green(`INFO: the dir ${name} has created.`));
        resolve();
        return;
      }

      gutil.log(gutil.colors.red(`ERROR: the dir ${name} has existed.`));
      resolve();
    });
  });
});

// gulp.task('imagemin', function() {
//   gulp.src('./app/lingh6/assets/*.{png,jpg,gif,ico}')
//     .pipe(imagemin({
//       optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
//       progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
//       interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
//       multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
//     }))
//     .pipe(gulp.dest('./dist/img'));
// });
