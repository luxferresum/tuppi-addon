const Plugin = require('broccoli-plugin');
const fs = require('fs');
const path = require('path');

// Create a subclass TemplateParser derived from Plugin
TemplateParser.prototype = Object.create(Plugin.prototype);
TemplateParser.prototype.constructor = TemplateParser;
function TemplateParser(inputNodes, options) {
  options = options || {};
  Plugin.call(this, inputNodes, {
    annotation: options.annotation
  });
  this.options = options;
}

TemplateParser.prototype.build = function() {
  // Read files from this.inputPaths, and write files to this.outputPath.
  // Silly example:

  const data = this.inputPaths
    .map(p => fs.readdirSync(p).map(f => path.join(p, f)))
    .reduce((a, b) => [...a, ...b], [])
    .map(f => ({
      name: path.basename(f, path.extname(f)),
      extension: path.extname(f),
      content: fs.readFileSync(f, { encoding: 'utf8' }),
    }))
    .reduce((arr, elem) => {
      arr.push(elem)
      return arr;
    }, []);

  const content = `
    define('tuppi-slides', [], function() {
      return ${JSON.stringify(data)};
     });
  `;

  fs.writeFileSync(path.join(this.outputPath, 'content.js'), content, { encoding: 'utf8' });
};

module.exports = TemplateParser;
