export default {
  id: 'music-player',
  initial: 'powerOff',
  states: {
    powerOff: {
      on: {
        power: 'powerOn'
      }
    },
    powerOn: {
      on: {
        power: 'powerOff',
      },
      initial: 'stopped',
      states: {
        stopped: {
          on: {
            play: 'playing'
          }
        },
        playing: {
          on: {
            stop: 'stopped',
            pause: 'paused'
          }
        },
        paused: {
          on: {
            stop: 'stopped',
            play: 'playing'
          }
        }
      }
    },
  }
};