import {validate} from 'class-validator';
import {Context} from 'koa';
import * as _ from 'lodash';
import {
  Body,
  Ctx,
  HttpCode,
  JsonController,
  MethodNotAllowedError,
  Param,
  Patch,
  Post,
} from 'routing-controllers';
import {Repository} from 'typeorm';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {User} from '../models/User.model';

@JsonController('/users')
export default class UsersController {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  @Post('/')
  @HttpCode(201)
  async create(
    @Ctx() ctx: Context,
    @Body() user: User,
  ): Promise<Partial<User> | void> {
    const validationErrors = await validate(user, {groups: ['create']});

    if (validationErrors.length > 0) {
      ctx.res.setHeader('Content-Type', 'application/json');
      ctx.res.write(
        JSON.stringify({
          name: 'UnprocessableEntity',
          message: 'Bad entity schema',
          errors: validationErrors,
        }),
      );
      return ctx.res.end();
    }

    const createProps = [
      'userName',
      'firstName',
      'lastName',
      'email',
      'isAdmin',
    ];
    return _.pick(
      await this.userRepo.save(
        this.userRepo.create(
          _.pick(user, [
            'userName',
            'firstName',
            'lastName',
            'email',
            'isAdmin',
          ]),
        ),
      ),
      ['id', ...createProps],
    );
  }

  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Ctx() ctx: Context,
    @Body() user: User,
  ): Promise<Partial<User>> {
    // TODO: Implement update method
    throw new MethodNotAllowedError('Implementation pending');
  }
}
