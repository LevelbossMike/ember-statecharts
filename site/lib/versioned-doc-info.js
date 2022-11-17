/* eslint-env node */
'use strict';

const getRepoInfo = require('git-repo-info');

module.exports = function (deployTarget) {
  let dir, name, rootURL, _path;
  let { sha, tag, branch } = getRepoInfo();

  if (deployTarget === 'tag') {
    dir = tag;
    name = tag;
    branch = null;
  } else if (deployTarget === 'branch') {
    dir = branch;
    name = branch;
    tag = null;
  } else if (deployTarget === 'latest') {
    dir = 'latest';
    name = 'Latest';
  } else {
    throw new Error(`unsupported deploy target ${deployTarget}`);
  }

  let destDir = `versions/${dir}`;

  if (deployTarget === 'latest') {
    rootURL = '/';
    _path = '';
  } else {
    rootURL = `/${destDir}/`;
    _path = destDir;
  }

  return {
    name,
    sha,
    tag,
    branch,
    destDir,
    rootURL,
    deployTarget,
    path: _path,
  };
};
