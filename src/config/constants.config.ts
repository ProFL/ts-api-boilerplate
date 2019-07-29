import Container from 'typedi';
import {ValidatorOptions} from 'class-validator';

export enum CONSTANT_KEYS {
  VALIDATOR_OPTIONS = 'defaults.validationOptions',
}

export default async function constantsSetup(): Promise<void> {
  const defaultValidatorOptions: ValidatorOptions = {
    whitelist: true,
    validationError: {target: false, value: false},
    skipMissingProperties: true,
    forbidUnknownValues: true,
  };

  Container.set(CONSTANT_KEYS.VALIDATOR_OPTIONS, defaultValidatorOptions);
}
