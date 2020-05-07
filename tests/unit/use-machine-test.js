import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { Machine } from 'xstate';
import { use } from 'ember-usable';
import Component from '@glimmer/component';

import { useMachine, matchesState } from 'ember-statecharts';

module('Unit | use-machine', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    const TestMachine = Machine(
      {
        initial: 'stopped',
        states: {
          stopped: {
            on: {
              START: {
                target: 'started',
                actions: ['lol'],
              },
            },
          },
          started: {
            on: {
              STOP: 'stopped',
            },
          },
        },
      },
      {
        actions: {
          lol() {},
        },
      }
    );

    this.set('TestMachine', TestMachine);
  });

  test('it is possible to work with `useMachine`', async function (assert) {
    const testContext = this;

    const { TestMachine } = this;

    class Test extends Component {
      @use statechart = useMachine(TestMachine)
        .withConfig({
          actions: {
            lol(context) {
              assert.equal(context.name, 'Tomster', 'context was updated as expected');
              assert.step('patched');
            },
          },
        })
        .withContext({
          name: this.name,
        });

      constructor(owner, args) {
        super(owner, args);

        testContext.test = this;

        this.name = 'Tomster';
      }
    }

    this.owner.register('component:test', Test);

    await render(hbs`
      <Test />
    `);

    assert.equal(
      testContext.test.statechart.currentState.value,
      'stopped',
      'statechart state is accessible'
    );

    testContext.test.statechart.send('START');

    assert.equal(
      testContext.test.statechart.currentState.value,
      'started',
      'statechart state updated'
    );

    assert.verifySteps(['patched'], 'config can be updated via `@use`');
  });

  test('`useMachine` works with `matchesState`', async function (assert) {
    const testContext = this;
    const { TestMachine } = this;

    class Test extends Component {
      @use statechart = useMachine(TestMachine);

      @matchesState('stopped')
      isStopped;

      constructor(owner, args) {
        super(owner, args);

        testContext.test = this;

        this.name = 'Tomster';
      }
    }

    this.owner.register('component:test', Test);

    await render(hbs`
      <Test />
    `);

    assert.equal(testContext.test.isStopped, true, 'matchesState works against initial state');

    testContext.test.statechart.send('START');

    assert.equal(
      testContext.test.isStopped,
      false,
      'matchesState updates correctly when state updates'
    );
  });
});