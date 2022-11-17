import { helper } from '@ember/component/helper';
import config from 'site/config/environment';

const { rootURL } = config;

export default helper(function ([version]) {
  return `${version}/` === rootURL.replace('/', '');
});
