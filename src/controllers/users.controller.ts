import * as _ from 'lodash';
import {
  Body,
  HttpCode,
  JsonController,
  NotFoundError,
  Param,
  Patch,
  Post,
} from 'routing-controllers';
import {Repository} from 'typeorm';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {UserUpdateDto} from '../helpers/dtos/user-update.dto';
import {User, UserValidationGroups} from '../models/User.model';

@JsonController('/users')
export default class UsersController {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  @Post('/')
  @HttpCode(201)
  async create(
    @Body({
      validate: {
        groups: ['default', 'create'] as UserValidationGroups[],
        validationError: {target: false},
        skipMissingProperties: true,
        forbidNonWhitelisted: true,
      },
    })
    user: User,
  ): Promise<Partial<User> | void> {
    const createProps = [
      'userName',
      'firstName',
      'lastName',
      'email',
      'isAdmin',
    ];

    return _.pick(
      await this.userRepo.save(this.userRepo.create(_.pick(user, createProps))),
      ['id', ...createProps],
    );
  }

  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body({
      validate: {
        groups: ['default', 'update'] as UserValidationGroups[],
        validationError: {target: false},
        skipMissingProperties: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
      },
    })
    user: UserUpdateDto,
  ): Promise<Partial<User> | void> {
    let dbUser: User;
    try {
      dbUser = await this.userRepo.findOneOrFail(id);
    } catch (err) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    Object.assign(
      dbUser,
      _.pick(user, ['firstName', 'lastName', 'email', 'password', 'isAdmin']),
    );

    if (user.newPassword) {
      dbUser.password = user.newPassword;
    }

    return _.omit(await this.userRepo.save(dbUser), [
      'password',
      'passwordToken',
      'createdAt',
      'updatedAt',
      'jwtService',
      'bcryptService',
    ]);
  }
}
