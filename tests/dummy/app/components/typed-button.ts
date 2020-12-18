// BEGIN-SNIPPET typed-button.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import Component from '@glimmer/component';
import { useMachine, matchesState, interpreterFor } from 'ember-statecharts';
import buttonMachine, { ButtonContext, ButtonEvent } from '../machines/typed-button';
import { TaskGenerator } from 'ember-concurrency';

import { task } from 'ember-concurrency-decorators';
import { taskFor } from 'ember-concurrency-ts';

import { use } from 'ember-could-get-used-to-this';
import { action } from '@ember/object';

interface ButtonArgs {
  disabled?: boolean;
  onClick?: () => any;
  onSuccess?: (result: any) => any;
  onError?: (error: any) => any;
}

/* eslint-disable-next-line @typescript-eslint/no-empty-function */
function noop() {}

export default class TypedButton extends Component<ButtonArgs> {
  get onClick(): any {
    return this.args.onClick || noop;
  }

  @matchesState({ activity: 'busy' })
  isBusy!: boolean;

  @matchesState({ interactivity: 'disabled' })
  isDisabled!: boolean;

  @matchesState({ interactivity: 'unknown' })
  isInteractivityUnknown!: boolean;

  get showAsDisabled(): boolean {
    const { isDisabled, isBusy, isInteractivityUnknown } = this;

    return isDisabled || isBusy || isInteractivityUnknown;
  }

  @use statechart = useMachine(buttonMachine)
    .withContext({
      disabled: this.args.disabled,
    })
    .withConfig({
      actions: {
        handleSubmit: this.performSubmitTask,
        handleSuccess: this.onSuccess,
        handleError: this.onError,
      },
    })
    .update(({ context, send }) => {
      const disabled = context?.disabled;

      if (disabled) {
        send('DISABLE');
      } else {
        send('ENABLE');
      }
    });

  @task *submitTask(): TaskGenerator<void> {
    try {
      const result = yield this.onClick();

      interpreterFor(this.statechart).send('SUCCESS', { result });
    } catch (e) {
      interpreterFor(this.statechart).send('ERROR', { error: e });
    }
  }

  @action
  handleClick(): void {
    const interpreter = interpreterFor(this.statechart);

    interpreter.send('SUBMIT');
  }

  @action
  onSuccess(_context: ButtonContext, { result }: Extract<ButtonEvent, { type: 'SUCCESS ' }>): any {
    const functionToCall = this.args.onSuccess || noop;

    return functionToCall(result);
  }

  @action
  onError(_context: ButtonContext, { error }: Extract<ButtonEvent, { type: 'ERROR' }>): any {
    const functionToCall = this.args.onError || noop;

    return functionToCall(error);
  }

  @action
  performSubmitTask(): void {
    taskFor(this.submitTask).perform();
  }
}
// END-SNIPPET
