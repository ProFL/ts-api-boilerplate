import {ValidationError, Validator, ValidatorOptions} from 'class-validator';
import * as _ from 'lodash';
import {
  Authorized,
  Body,
  Get,
  HttpCode,
  JsonController,
  NotFoundError,
  Param,
  Patch,
  Post,
} from 'routing-controllers';
import {Inject} from 'typedi';
import {Repository} from 'typeorm';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {CONSTANT_KEYS} from '../config/constants.config';
import {CreateUserDto} from '../helpers/dtos/models/User/create-user.dto';
import {UpdateUserDto} from '../helpers/dtos/models/User/update-user.dto';
import {User} from '../models/User.model';

@JsonController('/api/v1/users')
export default class UsersController {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @Inject(CONSTANT_KEYS.VALIDATOR_OPTIONS)
    private readonly defaultValidationOptions: ValidatorOptions,
    private readonly validator: Validator,
  ) {}

  @Get('/')
  @Authorized()
  async index(): Promise<Partial<User>[]> {
    return (await this.userRepo.find()).map(user =>
      _.omit(user, ['jwtService', 'bcryptService']),
    );
  }

  @Post('/')
  @HttpCode(201)
  async create(
    @Body({required: true})
    user: CreateUserDto,
  ): Promise<Partial<User> | void> {
    await this.validator.validateOrReject(user, this.defaultValidationOptions);

    const createProps = [
      'userName',
      'firstName',
      'lastName',
      'email',
      'isAdmin',
    ];

    try {
      return _.pick(
        await this.userRepo.save(
          this.userRepo.create(_.pick(user, createProps)),
        ),
        ['id', ...createProps],
      );
    } catch (err) {
      if (err.name === 'QueryFailedError') {
        if (/duplicate key value/.test(err.message)) {
          const [
            ,
            property,
            value,
          ] = /^Key \(([^)]+)\)=\(([^)]+)\) already exists\.$/g.exec(
            err.detail,
          );

          const validationError = new ValidationError();
          validationError.property = property;
          validationError.value = value;
          validationError.constraints = {unique: `${property} must be unique`};

          throw validationError;
        }
      }
      throw err;
    }
  }

  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body({required: true})
    user: UpdateUserDto,
  ): Promise<Partial<User> | void> {
    /*
     * TODO: Fix edge case where if you try to update and user
     * by sending the same e-mail as the current one it will deny
     * on the Unique validation constraint.
     */
    await this.validator.validateOrReject(user, this.defaultValidationOptions);

    let dbUser: User;
    try {
      dbUser = await this.userRepo.findOneOrFail(id);
    } catch (err) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    Object.assign(dbUser, _.omit(user, ['passwordConfirmation']));

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
