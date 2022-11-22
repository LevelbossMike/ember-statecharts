/* eslint-disable no-undef */
// BEGIN-SNIPPET typed-button
import Component from '@glimmer/component';
import { useMachine } from 'ember-statecharts';
import buttonMachine, {
  ButtonContext,
  ButtonEvent,
  ButtonState,
} from '../machines/typed-button';
interface ButtonArgs {
  disabled?: boolean;
  onClick?: () => any;
  onSuccess?: (result: any) => any;
  onError?: (error: any) => any;
}

function noop() {}

export default class TypedButton extends Component<ButtonArgs> {
  get onClick(): any {
    return this.args.onClick || noop;
  }

  get isBusy() {
    return this.statechart.state.matches({ activity: 'busy' });
  }

  get isDisabled() {
    return this.statechart.state.matches({ interactivity: 'disabled' });
  }

  get isInteractivityUnknown() {
    return this.statechart.state.matches({ interactivity: 'unknown' });
  }

  get showAsDisabled() {
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
              handleSuccess: this.onSuccess,
              handleError: this.onError,
            },
            services: {
              handleSubmit: this.onClick,
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

  handleClick = () => {
    this.statechart.send('SUBMIT');
  };

  onSuccess = (
    _context: ButtonContext,
    { data: result }: Extract<ButtonEvent, { type: 'done.invoke.handleSubmit' }>
  ): any => {
    const functionToCall = this.args.onSuccess || noop;

    return functionToCall(result);
  };

  onError = (
    _context: ButtonContext,
    {
      data: error,
    }: Extract<ButtonEvent, { type: 'error.platform.handleSubmit' }>
  ): any => {
    const functionToCall = this.args.onError || noop;

    return functionToCall(error);
  };
}
// END-SNIPPET
