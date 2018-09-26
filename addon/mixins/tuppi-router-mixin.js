import Mixin from '@ember/object/mixin';

import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Mixin.create({
  tuppi: service(),
  model(params) {
    this.tuppi.broadcastUpdate(params.slideset, params.slide, params.step);
    return params;
  },

  update: computed({
    get() {
      return (...args) => {
        this.transitionTo(this.routeName, ...args);
      }
    }
  }),

  activate() {
    this.tuppi.registerUpdateListener(this.update);
  },
});
