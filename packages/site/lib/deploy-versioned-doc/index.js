/* eslint-env node */
'use strict';

const versionedDocInfo = require('../versioned-doc-info');
const path = require('path');
const fs = require('fs-extra');
const os = require('os');

module.exports = {
  name: require('./package').name,

  createDeployPlugin: function (options) {
    return {
      name: options.name,

      async willUpload(context) {
        const {
          deployTarget,
          distDir,
          gitDeploy: { worktreePath },
        } = context;

        const { name, destDir, rootURL, sha, tag } = versionedDocInfo(
          deployTarget
        );

        // cache current build
        let currentBuild = path.join(os.tmpdir(), 'current-build-');
        fs.moveSync(distDir, currentBuild);

        // ensure we have a ${worktree}/versions/
        let versions = path.resolve(worktreePath, 'versions');
        fs.ensureDirSync(versions);

        if (deployTarget === 'latest') {
          // keep the current versions
          fs.copySync(versions, path.resolve(currentBuild, 'versions'));

          // make current build the new dist
          fs.moveSync(currentBuild, distDir);
        } else {
          // keep current state of gh-pages
          fs.copySync(worktreePath, distDir);

          // move current build into versions/${branch || tag}
          fs.moveSync(currentBuild, path.resolve(distDir, destDir), {
            overwrite: true,
          });
        }

        // get ${worktree}/versions.json
        let versionsJSON = {};
        let versionsFile = path.resolve(worktreePath, 'versions.json');
        if (fs.existsSync(versionsFile)) {
          versionsJSON = fs.readJsonSync(versionsFile);
        }

        let key = name;

        // update key for latest, this is for ember-cli-addon-docs compatibility
        if (deployTarget === 'latest') {
          key = '-latest';
        }

        versionsJSON[key] = {
          path: rootURL,
          name,
          sha,
          tag,
        };

        // write current versions.json
        fs.writeFileSync(
          path.resolve(distDir, 'versions.json'),
          JSON.stringify(versionsJSON, null, 2)
        );

        fs.removeSync(currentBuild);
      },
    };
  },
};
