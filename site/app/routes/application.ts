import Route from '@ember/routing/route';
import config from 'site/config/environment';
import { action } from '@ember/object';

export default class ApplicationRoute extends Route {
  @action didTransition(): void {
    if (
      config.environment !== 'test' &&
      window &&
      typeof window.scrollTo === 'function'
    ) {
      window.scrollTo(0, 0);
    }
  }
}
