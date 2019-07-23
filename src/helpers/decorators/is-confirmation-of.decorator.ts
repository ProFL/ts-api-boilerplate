import {registerDecorator, ValidationOptions} from 'class-validator';

export function IsConfirmationOf(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function(object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isConfirmationOf',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value, args) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },
      },
    });
  };
}
