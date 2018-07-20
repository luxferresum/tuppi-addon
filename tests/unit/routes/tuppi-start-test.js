import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | tuppi-start', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:tuppi-start');
    assert.ok(route);
  });
});
