import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import config from 'site/config/environment';
import { action } from '@ember/object';

import MetricsService from 'ember-metrics/services/metrics';

export default class ApplicationRoute extends Route {
  @service
  router!: RouterService;

  @service
  metrics!: MetricsService;

  constructor() {
    // eslint-disable-next-line prefer-rest-params
    super(...arguments);

    this.setupTracking();
  }

  @action
  didTransition(): void {
    if (
      config.environment !== 'test' &&
      window &&
      typeof window.scrollTo === 'function'
    ) {
      window.scrollTo(0, 0);
    }
  }

  private setupTracking() {
    this.router.on('routeDidChange', () => {
      const { currentURL, currentRouteName } = this.router;

      this.metrics.trackPage({
        page: currentURL,
        title: currentRouteName,
      });
    });
  }
}
