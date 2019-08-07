import * as classTransformer from 'class-transformer';
import {ClassType} from 'class-transformer/ClassTransformer';
import {validateOrReject} from 'class-validator';
import {Middleware} from 'koa';
import Container from 'typedi';
import {CONSTANT_KEYS} from '../config/constants.config';
import {KoaContext} from '../helpers/interfaces/koa-context.interface';

export function ValidateBody<T>(bodyType: ClassType<T>): Middleware {
  return async (ctx: KoaContext, next) => {
    const bodyObject: T = classTransformer.plainToClass(
      bodyType,
      ctx.request.body,
    );
    try {
      await validateOrReject(
        bodyObject,
        Container.get(CONSTANT_KEYS.VALIDATOR_OPTIONS),
      );
    } catch (err) {
      ctx.status = 422;

      ctx.response.body = {
        name: 'UnprocessableEntity',
        message: 'Sent object has validation errors, look at errors',
        errors: err,
      };

      return;
    }

    next();
  };
}
