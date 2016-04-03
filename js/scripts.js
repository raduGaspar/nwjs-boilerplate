(function() {
  var gui = require('nw.gui'),
    win = gui.Window.get();

  // show the developer tools
  // all console.log occurrences will be removed on build
  console.log(win.showDevTools());
}());