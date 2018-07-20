import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | tuppi-slides', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let controller = this.owner.lookup('controller:tuppi-slides');
    assert.ok(controller);
  });
});
