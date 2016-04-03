var

// Dependencies
gulp = require('gulp'),
concat = require('gulp-concat'),
minifyCss = require('gulp-minify-css'),
uglify = require('gulp-uglify'),
stripDebug = require('gulp-strip-debug'),
domSrc = require('gulp-dom-src'),
cheerio = require('gulp-cheerio'),
p = require('./package.json'),

// File Paths
base = '/',
build = 'dist/',
css = 'css/',
js = 'js/',
nodeDeps = 'node_modules/',

path = {
  outputNames: {
    css: 'hello-nwjs.min.css',
    js: 'hello-nwjs.min.js'
  },
  input: {
    js: base + '**/*.js',
  },
  output: {
    nodeDeps: build + nodeDeps
  }
};

// Tasks:

/*
 * Read all CSS files from index.html
 * concat and minify them
 */
gulp.task('css', function() {
  var buildPath = build + css;

  return domSrc({file:'index.html', selector:'link', attribute:'href'})
    .pipe(concat(path.outputNames.css))
    .pipe(gulp.dest(buildPath))
    .pipe(minifyCss())
    .pipe(gulp.dest(buildPath));
});

/*
 * Read all JS files from index.html
 * concat and minify them
 */
gulp.task('js', function() {
  var buildPath = build + js;

  return domSrc({file:'index.html', selector:'script', attribute:'src'})
    .pipe(concat(path.outputNames.js))
    .pipe(gulp.dest(buildPath))
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest(buildPath));
});

/*
 * Generate distribution index.html
 * based on old HTML and new CSS and JS files
 */
gulp.task('indexHtml', function() {
  return gulp.src('index.html')
    .pipe(cheerio(function($) {
      $.fn.cleanWhitespace = function() {
        textNodes = this.contents().filter(
          function() { return (this.nodeType == 3 && !/\S/.test(this.nodeValue)); })
          .remove();
        return this;
      };

      var jsSrc = js + path.outputNames.js,
        cssSrc = css + path.outputNames.css;

      // remove all scripts files with source tags
      $('script[src]').remove();
      // remove all style tags
      $('link').remove();
      // create script and link tags for minified files
      $('body').prepend('<script src="'+jsSrc+'"></script>');
      $('head').append('<link rel="stylesheet" href="'+cssSrc+'">');
      // clean html of any whitespaces
      $('head').cleanWhitespace();
      $('body').cleanWhitespace();
    }))
    .pipe(gulp.dest(build));
});

// Node dependencies modules copy task
// ignores developer dependencies
gulp.task('nodeDeps', function() {
  var res = [];
  for(var i in p.dependencies) {
    res.push(nodeDeps+i+'/**/*.*');
  }

  return gulp.src(res, { base: nodeDeps })
    .pipe(gulp.dest(path.output.nodeDeps));
});

// copy package.json to dist
gulp.task('packageFile', function() {
  return gulp.src('package.json')
    .pipe(gulp.dest(build));
});

// Default task
gulp.task('default', [
  'css',
  'js',
  'indexHtml',
  'nodeDeps',
  'packageFile'
]);