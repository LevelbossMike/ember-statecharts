import EmberObject, { get } from '@ember/object';
import { module, test } from 'qunit';
import { statechart, matchesState, debugState } from 'ember-statecharts/computed';

module('Unit | statechart computeds', function(hooks) {
  hooks.beforeEach(function() {
    this.subject = EmberObject.extend({
      statechart: statechart({
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
      }),

      playerIsOff: matchesState('playerOff'),
      playerIsOn: matchesState('playerOn'),
      playerIsStopped: matchesState({
        playerOn: 'stopped',
      }),

      playerIsPlaying: matchesState({
        playerOn: 'playing',
      }),

      playerIsPaused: matchesState({
        playerOn: 'paused',
      }),

      playerActiveMusicNotPlaying: matchesState([
        {
          playerOn: 'stopped',
        },
        {
          playerOn: 'paused',
        },
      ]),

      _debug: debugState(),
    }).create();
  });

  module('#matchesState', function() {
    test('can be used to match against the current state of the statechart', async function(assert) {
      let { subject } = this;

      assert.equal(get(subject, 'playerIsOff'), true, 'works for initial states');

      await subject.get('statechart').send('power');

      assert.equal(get(subject, 'playerIsOn'), true, 'works after updating state');

      assert.equal(get(subject, 'playerIsStopped'), true, 'works for nested states');

      await subject.get('statechart').send('play');

      assert.equal(
        get(subject, 'playerIsStopped'),
        false,
        'works inside of nested states - stopped false - playing again'
      );
      assert.equal(
        get(subject, 'playerIsPlaying'),
        true,
        'works inside of nested states - playing true - playing'
      );

      await subject.get('statechart').send('pause');

      assert.equal(
        get(subject, 'playerIsStopped'),
        false,
        'works inside of nested states - stopped false - paused'
      );
      assert.equal(
        get(subject, 'playerIsPlaying'),
        false,
        'works inside of nested states - playing false - paused'
      );
      assert.equal(
        get(subject, 'playerIsPaused'),
        true,
        'works inside of nested states - paused true - paused'
      );

      assert.equal(get(subject, 'playerActiveMusicNotPlaying'), true, 'works when passing array');
    });
  });

  module('#debugState', function() {
    test('can be used to log the current state of the statechart as a string', async function(assert) {
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
  });
});
