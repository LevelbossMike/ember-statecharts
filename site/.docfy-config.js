/* eslint-disable node/no-missing-require */
const path = require('path');
const autolinkHeadings = require('remark-autolink-headings');
const docfyWithProse = require('@docfy/plugin-with-prose');
const prism = require('@mapbox/rehype-prism');
const refractor = require('refractor');

refractor.alias('handlebars', 'hbs');
refractor.alias('shell', 'sh');

module.exports = {
  tocMaxDepth: 3,
  sources: [
    {
      root: path.resolve(__dirname, './app/docs'),
      pattern: '**/*.md',
      urlPrefix: 'docs',
    },
  ],
  remarkPlugins: [
    [
      autolinkHeadings,
      {
        behavior: 'wrap',
      },
    ],
  ],
  plugins: [docfyWithProse],
  rehypePlugins: [prism],
  labels: {
    components: 'Components',
    workflow: 'Workflow',
    docs: 'Documentation',
  },
};
