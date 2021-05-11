const autolinkHeadings = require('remark-autolink-headings');
const docfyWithProse = require('@docfy/plugin-with-prose');

module.exports = {
  tocMaxDepth: 3,
  remarkPlugins: [
    [
      autolinkHeadings,
      {
        behavior: 'wrap',
      },
    ],
  ],
  plugins: [docfyWithProse],
  labels: {
    components: 'Components',
    workflow: 'Workflow',
    docs: 'Documentation',
  },
};
