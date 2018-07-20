import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | tuppi-slides', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:tuppi-slides');
    assert.ok(route);
  });
});
