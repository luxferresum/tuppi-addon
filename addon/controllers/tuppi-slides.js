import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Controller.extend({
  tuppi: service(),
  nextArgs: computed('model', {
    get() {
      const {model} = this;
      return this.tuppi.nextStep(model.slideset, model.slide, model.step);
    },
  }),
  nextSlideset: computed.alias('nextArgs.0'),
  nextSlide: computed.alias('nextArgs.1'),
  nextStep: computed.alias('nextArgs.2'),

  previousArgs: computed('model', {
    get() {
      const {model} = this;
      return this.tuppi.previousStep(model.slideset, model.slide, model.step);
    },
  }),
  previousSlideset: computed.alias('previousArgs.0'),
  previousSlide: computed.alias('previousArgs.1'),
  previousStep: computed.alias('previousArgs.2'),
});
