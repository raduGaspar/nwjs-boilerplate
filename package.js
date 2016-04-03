var NwBuilder = require('nw-builder'),
  output = 'c:/builds',
  opts = {
    files: './dist/**', // use the glob format
    version: '0.12.3',
    buildDir: output + '/build/',
    cacheDir: output + '/cache/',
    platforms: ['win64', 'osx64', 'linux64']
  },
  nw = new NwBuilder(opts);

// log build details
nw.on('log', console.log);

// start build
nw.build().then(function() {
  console.log('App packaged in', opts.buildDir);
}).catch(function(error) {
  console.error(error);
});