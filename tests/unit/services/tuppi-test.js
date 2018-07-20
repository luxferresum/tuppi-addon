import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | tuppi', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.foo = 12;
  });

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let service = this.owner.lookup('service:tuppi');
    assert.ok(service);
    assert.equal(this.foo, 13);
  });
});

