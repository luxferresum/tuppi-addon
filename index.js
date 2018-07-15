'use strict';

const Funnel = require('broccoli-funnel');
const MergeTrees = require('broccoli-merge-trees');
const TemplateParser = require('./template-parser');

module.exports = {
  name: 'tuppi-addon',
  treeForAddon() {
    var tree = this._super.treeForAddon.apply(this, arguments);
    console.log('env' + process.env.TUPPI_TEMPLATE_DIR);

    const template = new Funnel(process.env.TUPPI_TEMPLATE_DIR);
    const processed = new TemplateParser([template]);
    return new MergeTrees([tree, processed]);
  },

  isDevelopingAddon() {
    return true;
  },
};
