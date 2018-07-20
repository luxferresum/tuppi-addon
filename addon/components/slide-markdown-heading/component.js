import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,
  tagName: '',
  didReceiveAttrs() {
    this.set('tagName', `h${this.node.depth}`);
  },
});
