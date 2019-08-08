import {ValidatorOptions} from 'class-validator';
import Container from 'typedi';
import {CONSTANT_KEYS} from '../helpers/enums/constants.enum';

export default async function constantsSetup(): Promise<void> {
  const defaultValidatorOptions: ValidatorOptions = {
    whitelist: true,
    validationError: {target: false, value: false},
    skipMissingProperties: true,
    forbidUnknownValues: true,
  };

  Container.set(CONSTANT_KEYS.VALIDATOR_OPTIONS, defaultValidatorOptions);
}
