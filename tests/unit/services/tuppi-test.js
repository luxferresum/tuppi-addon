import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | tuppi', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.service = this.owner.lookup('service:tuppi');
    this.service.slidesets = [
      [{ steps: ['x', 'x'] }],
      [{ steps: ['x', 'x'] }, { steps: ['x', 'x'] }],
    ];
  });

  // Replace this with your real tests.
  test('nextStep works', function(assert) {
    assert.deepEqual(this.service.nextStep(0, 0, 0), [0, 0, 1], 'from 0.0.0');
    assert.deepEqual(this.service.nextStep(0, 0, 1), [1, 0, 0], 'from 0.0.1');
    assert.deepEqual(this.service.nextStep(1, 0, 1), [1, 1, 0], 'from 1.0.1');
  });

  test('previousStep works', function(assert) {
    assert.deepEqual(this.service.previousStep(0, 0, 1), [0, 0, 0], 'from 0.0.1');
    assert.deepEqual(this.service.previousStep(1, 0, 0), [0, 0, 1], 'from 1.0.0');
    assert.deepEqual(this.service.previousStep(1, 1, 0), [1, 0, 1], 'from 1.1.0');
  });
});

