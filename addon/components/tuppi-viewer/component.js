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
  }),

  listener: computed({
    get() {
      return event => {
        switch (event.key) {
          case 'ArrowLeft':
            this.element.querySelector('.tuppi__previous').click();
            break;
          case 'ArrowRight':
            this.element.querySelector('.tuppi__next').click();
            break;
        }
      };
    },
  }),
  didInsertElement() {
    window.addEventListener('keydown', this.listener);
  },
  willDestroyElement() {
    window.removeEventListener('keydown', this.listener);
  },
});
