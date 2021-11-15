import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import {
  statechart,
  matchesState,
  debugState,
} from 'ember-statecharts/computed';

module('Unit | statechart computeds', function (hooks) {
  hooks.beforeEach(function () {
    class TestClass extends EmberObject {
      @statechart({
        initial: 'playerOff',
        states: {
          playerOff: {
            on: {
              power: 'playerOn',
            },
          },
          playerOn: {
            initial: 'stopped',
            on: {
              power: 'playerOff',
            },
            states: {
              stopped: {
                on: {
                  play: 'playing',
                },
              },
              playing: {
                on: {
                  stop: 'stopped',
                  pause: 'paused',
                },
              },
              paused: {
                on: {
                  play: 'playing',
                  stop: 'stopped',
                },
              },
            },
          },
        },
      })
      statechart;

      @statechart({
        initial: 'off',

        states: {
          off: {
            on: {
              POWER: 'on',
            },
          },
          on: {
            on: {
              POWER: 'off',
            },
            initial: 'paused',
            states: {
              paused: {
                on: {
                  START: 'started',
                },
              },
              started: {
                on: {
                  PAUSE: 'paused',
                },
              },
            },
          },
        },
      })
      secondStatechart;

      @matchesState('playerOff')
      playerIsOff;
      @matchesState('playerOn')
      playerIsOn;

      @matchesState({
        playerOn: 'stopped',
      })
      playerIsStopped;

      @matchesState({
        playerOn: 'playing',
      })
      playerIsPlaying;

      @matchesState({
        playerOn: 'paused',
      })
      playerIsPaused;

      @matchesState([
        {
          playerOn: 'stopped',
        },
        {
          playerOn: 'paused',
        },
      ])
      playerActiveMusicNotPlaying;

      @matchesState('off', 'secondStatechart')
      secondIsOff;

      @matchesState('on', 'secondStatechart')
      secondIsOn;

      @matchesState({ on: 'started' }, 'secondStatechart')
      secondIsStarted;

      @debugState()
      _debug;

      @debugState('secondStatechart')
      _debugSecond;
    }

    this.subject = TestClass.create();
  });

  module('#matchesState', function () {
    test('can be used to match against the current state of the statechart', async function (assert) {
      let { subject } = this;

      assert.equal(subject.playerIsOff, true, 'works for initial states');

      await subject.get('statechart').send('power');

      assert.equal(subject.playerIsOn, true, 'works after updating state');

      assert.equal(subject.playerIsStopped, true, 'works for nested states');

      await subject.get('statechart').send('play');

      assert.equal(
        subject.playerIsStopped,
        false,
        'works inside of nested states - stopped false - playing again'
      );
      assert.equal(
        subject.playerIsPlaying,
        true,
        'works inside of nested states - playing true - playing'
      );

      await subject.get('statechart').send('pause');

      assert.equal(
        subject.playerIsStopped,
        false,
        'works inside of nested states - stopped false - paused'
      );
      assert.equal(
        subject.playerIsPlaying,
        false,
        'works inside of nested states - playing false - paused'
      );
      assert.equal(
        subject.playerIsPaused,
        true,
        'works inside of nested states - paused true - paused'
      );

      assert.equal(
        subject.playerActiveMusicNotPlaying,
        true,
        'works when passing array'
      );
    });

    test('it can be used with other computeds not named `statechart`', async function (assert) {
      let { subject } = this;

      assert.equal(
        subject.get('secondIsOff'),
        true,
        'work for initial state of second statechart'
      );

      await subject.get('secondStatechart').send('POWER');

      assert.equal(
        subject.get('secondIsOff'),
        false,
        'matchesState updates with custom named statecharts'
      );

      assert.equal(
        subject.get('secondIsOn'),
        true,
        'matchesState computeds work as expected for second statechart'
      );

      await subject.get('secondStatechart').send('START');

      assert.equal(
        subject.get('secondIsStarted'),
        true,
        'matchesState computeds work as expected for nested states for second statechart'
      );
    });
  });

  module('#debugState', function () {
    test('can be used to log the current state of the statechart as a string', async function (assert) {
      let { subject } = this;

      assert.deepEqual(subject.get('_debug'), '"playerOff"');

      await subject.get('statechart').send('power');

      assert.deepEqual(
        subject.get('_debug'),
        JSON.stringify({ playerOn: 'stopped' }, 'works for nested states')
      );

      await subject.get('statechart').send('play');

      assert.deepEqual(
        subject.get('_debug'),
        JSON.stringify({ playerOn: 'playing' }, 'updates when state is updated')
      );
    });

    test('can be used to log the current state of the statechart as a string', async function (assert) {
      let { subject } = this;

      assert.deepEqual(subject.get('_debugSecond'), '"off"');

      await subject.get('secondStatechart').send('POWER');

      assert.deepEqual(
        subject.get('_debugSecond'),
        JSON.stringify({ on: 'paused' }, 'works for nested states')
      );

      await subject.get('secondStatechart').send('START');

      assert.deepEqual(
        subject.get('_debugSecond'),
        JSON.stringify({ on: 'started' }, 'updates when state is updated')
      );
    });
  });
});
