
import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import move from 'ember-animated/motions/move';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';

export default Component.extend({
  tagName: '',

  notificationsService: service('notifications'),

  notifications: readOnly('notificationsService.notifications'),

  // eslint-disable-next-line require-yield
  * transition({ insertedSprites, keptSprites, removedSprites }) {
    insertedSprites.forEach(fadeIn);
    keptSprites.forEach(move);
    removedSprites.forEach(sprite => {
      const { top } = sprite.absoluteInitialBounds;
      sprite.endAtPixel({ y: top - 50 });
      move(sprite);
    })
    removedSprites.forEach(fadeOut);
  },
});