import Component from '@ember/component';
import layout from './template';
import { inject } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  layout,
  tuppi: inject(),
  slideset: 0,
  slide: 0,
  step: 0,
  stepGetter: computed('step', 'showSteps', {
    get() {
      if(this.showSteps) {
        return `steps.${this.step}`;
      }
      return 'slide';
    }
  })
});
