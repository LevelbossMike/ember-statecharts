declare module 'ember-metrics/services/metrics' {
  import Service from '@ember/service';

  export default class Metrics extends Service {
    trackEvent(params: Record<string, unknown>): void;

    trackPage(params: Record<string, unknown>): void;
    trackPage(adapterName: string, params: Record<string, unknown>): void;
  }
}
