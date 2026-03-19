// @dsp obj-b4b83346
/* eslint-disable @typescript-eslint/no-unused-vars */
import libMoment from 'moment';
import { MomentInput, MomentFormatSpecification, Moment } from 'moment';
export type { Moment } from 'moment';

// @dsp func-4277b680
export function moment(
  _inp?: MomentInput,
  _format?: MomentFormatSpecification,
  _strict?: boolean,
): Moment {
  // eslint-disable-next-line prefer-rest-params
  return libMoment(...arguments).utcOffset(0);
}
