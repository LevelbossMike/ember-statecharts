import Component from '@glimmer/component';
import { action } from '@ember/object';
import { createMachine, assign } from 'xstate';
import { useMachine, matchesState } from 'ember-statecharts';
import config from 'site/config/environment';

const versionsMachine = createMachine(
  {
    initial: 'loading',
    context: {
      versions: null,
      error: null,
    },

    states: {
      loading: {
        invoke: {
          src: 'loadVersions',
          onDone: 'success',
          onError: 'error',
        },
      },
      success: {
        entry: [
          assign({
            versions: (context, { data }) => data,
          }),
        ],
      },
      error: {
        entry: [
          assign({
            error: (context, { data }) => data,
          }),
        ],
      },
    },
  },
  {
    services: {
      async loadVersions() {},
    },
  }
);
export default class VersionsDropdown extends Component {
  statechart = useMachine(this, () => {
    const { loadVersions } = this;
    return {
      machine: versionsMachine.withConfig({
        services: {
          loadVersions,
        },
      }),
    };
  });

  @matchesState('success')
  isSuccess;

  get rootURL() {
    return config.rootURL;
  }

  get versions() {
    const versions = this.statechart.state.context.versions;
    const latest = versions['-latest'];
    const primary = versions['master'];

    const otherTags = Object.keys(versions)
      .filter((v) => !['-latest', 'master'].includes(v))
      .map((key) => versions[key])
      .sort((tagA, tagB) => {
        let keyA = tagA.tag.replace('v', '');
        let keyB = tagB.tag.replace('v', '');

        if (keyA > keyB) {
          return -1;
        }
        if (keyA < keyB) {
          return 1;
        }

        // names must be equal
        return 0;
      });

    return [latest, primary, ...otherTags].map((v) => {
      if (v.path) {
        v.label = `${v.name} - ${v.sha.substring(0, 5)}`;
      } else {
        v.label = `${v.name} - ${v.tag}`;
      }

      return v;
    });
  }

  @action redirectTo({ target: { value } }) {
    window.location.href = `/${value}`;
  }

  @action async loadVersions() {
    const fetchResult = await fetch('/versions.json');

    if (fetchResult.ok) {
      return await fetchResult.json();
    }

    throw Error('Error loading versions');
  }
}
