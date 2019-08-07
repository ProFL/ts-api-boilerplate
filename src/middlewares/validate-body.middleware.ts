import * as classTransformer from 'class-transformer';
import {ClassType} from 'class-transformer/ClassTransformer';
import {validateOrReject, ValidatorOptions} from 'class-validator';
import {Middleware} from 'koa';
import Container from 'typedi';
import {CONSTANT_KEYS} from '../config/constants.config';
import {KoaContext} from '../helpers/interfaces/koa-context.interface';

export function ValidateBody<T>(
  bodyType: ClassType<T>,
  validatorOptions?: ValidatorOptions,
): Middleware {
  return async (ctx: KoaContext, next) => {
    const bodyObject = classTransformer.plainToClass(
      bodyType,
      ctx.request.body,
      {
        enableImplicitConversion: true,
      },
    );

    try {
      await validateOrReject(bodyObject, {
        ...Container.get(CONSTANT_KEYS.VALIDATOR_OPTIONS),
        ...validatorOptions,
      });

      ctx.request.body = bodyObject;

      await next();
    } catch (errors) {
      ctx.status = 422;

      ctx.response.body = {
        name: 'UnprocessableEntity',
        message: 'Sent object has validation errors, look at errors',
        errors,
      };
    }
  };
}
