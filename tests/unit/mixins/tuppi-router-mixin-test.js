import EmberObject from '@ember/object';
import TuppiRouterMixinMixin from 'tuppi-addon/mixins/tuppi-router-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | TuppiRouterMixin', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let TuppiRouterMixinObject = EmberObject.extend(TuppiRouterMixinMixin);
    let subject = TuppiRouterMixinObject.create();
    assert.ok(subject);
  });
});
