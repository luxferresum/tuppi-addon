import EmberObject from '@ember/object';
import TuppiControllerMixinMixin from 'tuppi-addon/mixins/tuppi-controller-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | TuppiControllerMixin', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let TuppiControllerMixinObject = EmberObject.extend(TuppiControllerMixinMixin);
    let subject = TuppiControllerMixinObject.create();
    assert.ok(subject);
  });
});
