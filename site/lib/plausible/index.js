/* eslint-env node */
'use strict';

module.exports = {
  name: 'plausible',

  contentFor(type, config) {
    const plausible = config.plausible || {};

    if (type === 'head-footer' && plausible.src && plausible.domain) {
      return `<script defer data-domain="${plausible.domain}" src="${plausible.src}"></script>`;
    }

    return '';
  },
};
