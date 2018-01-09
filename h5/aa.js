
let browserSync = require("browser-sync");
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
  browserSync(options, function(...arg) {
      console.info(arg);
});