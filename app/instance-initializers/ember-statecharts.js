import Router from '../router';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

const StatechartsApplicationRoute = Route.extend({
  router: service('-routing'),

  renderTemplate() {
    this.render('applicationStatecharts', {
      controller: this.controllerFor('applicationStatecharts')
    });
  }
});

export function initialize(appInstance) {
  let fastboot = appInstance.lookup('service:fastboot');
  let fastbootIsInstalled = fastboot;
  let fastbootIsNotInstalled = !fastboot;
  let notUsingFastboot = fastbootIsNotInstalled || (fastbootIsInstalled && !fastboot.get('isFastBoot'));
  let router = appInstance.lookup('service:router')._router;
  let initialURL = router.initialURL || ((window && window.location) ? window.location.href : ''); // fastboot guard :/

  if (notUsingFastboot && initialURL.match('/statecharts')) {
    appInstance.register('route:application', StatechartsApplicationRoute);
    Router.map(function() {
      this.route('statecharts');
    });
  }
}

export default {
  initialize
};
