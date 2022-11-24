import Component from '@glimmer/component';
import config from 'site/config/environment';

export default class ApiTocComponent extends Component {
  get rootUrl() {
    return config.rootURL;
  }
}
