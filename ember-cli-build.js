'use strict';
const crawl = require('prember-crawler');
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  let app = new EmberAddon(defaults, {
    // Add options here
    postcssOptions: {
      compile: {
        includePaths: ['app'],
        cacheInclude: [/.*\.hbs$/, /.*\.css$/, /.*\.html/],
        plugins: [
          require('tailwindcss')('./tailwind.config.js'),
          require('autoprefixer'),
        ],
      },
    },
    snippetPaths: ['tests/dummy/app'],
    snippetSearchPaths: ['tests/dummy', 'docs'],
    'ember-prism': {
      theme: 'tomorrow',
      components: ['markup-templating', 'handlebars', 'typescript'],
    },
    prember: {
      urls: async ({ visit }) => {
        let docsURLs = await crawl({
          visit,
          startingFrom: ['/docs'],
          selector: 'a[data-prember]',
        });

        let otherURLS = ['/', '/docs'];

        return docsURLs.concat(otherURLS);
      },
    },
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app);
};
