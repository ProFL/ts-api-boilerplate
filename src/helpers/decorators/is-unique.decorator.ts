import {registerDecorator, ValidationOptions} from 'class-validator';
import {getRepository, EntitySchema} from 'typeorm';

export function IsUnique(
  entityClass: string | Function | (new () => any) | EntitySchema<any>,
  idPropertyName: string = 'id',
  validationOptions?: ValidationOptions,
) {
  return function(object: Record<string, any>, propertyName: string) {
    registerDecorator({
      async: true,
      name: 'isUnique',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        async validate(value, args) {
          const entityRepo = getRepository(entityClass);
          const results = await entityRepo.find({
            where: {[propertyName]: value},
            take: 1,
          });

          if (results.length > 0) {
            return results[0][idPropertyName] === args.object[idPropertyName];
          }

          return results.length === 0;
        },
      },
    });
  };
}
