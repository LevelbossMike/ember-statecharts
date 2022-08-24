// BEGIN-SNIPPET typed-button
/* eslint-disable @typescript-eslint/no-explicit-any */
import Component from '@glimmer/component';
import { useMachine, matchesState } from 'ember-statecharts';
import buttonMachine, {
  ButtonContext,
  ButtonEvent,
  ButtonState,
} from '../machines/typed-button';

import { task } from 'ember-concurrency';

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

  statechart = useMachine<ButtonContext, any, ButtonEvent, ButtonState>(
    this,
    () => {
      return {
        machine: buttonMachine
          .withContext({
            disabled: this.args.disabled,
          })
          .withConfig({
            actions: {
              handleSubmit: this.performSubmitTask,
              handleSuccess: this.onSuccess,
              handleError: this.onError,
            },
          }),
        update: ({ machine, send }) => {
          const disabled = machine.context?.disabled;

          if (disabled) {
            send('DISABLE');
          } else {
            send('ENABLE');
          }
        },
      };
    }
  );

  submitTask = task(this, async () => {
    try {
      const result = await this.onClick();

      this.statechart.send('SUCCESS', { result });
    } catch (e) {
      this.statechart.send('ERROR', { error: e });
    }
  });

  @action
  handleClick(): void {
    this.statechart.send('SUBMIT');
  }

  @action
  onSuccess(
    _context: ButtonContext,
    { result }: Extract<ButtonEvent, { type: 'SUCCESS ' }>
  ): any {
    const functionToCall = this.args.onSuccess || noop;

    return functionToCall(result);
  }

  @action
  onError(
    _context: ButtonContext,
    { error }: Extract<ButtonEvent, { type: 'ERROR' }>
  ): any {
    const functionToCall = this.args.onError || noop;

    return functionToCall(error);
  }

  @action
  performSubmitTask(): void {
    this.submitTask.perform();
  }
}
// END-SNIPPET
