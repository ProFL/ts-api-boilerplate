import {ValidationError, Validator} from 'class-validator';
import * as _ from 'lodash';
import {
  Authorized,
  Body,
  Delete,
  Get,
  HttpCode,
  JsonController,
  MethodNotAllowedError,
  NotFoundError,
  Param,
  Patch,
  Post,
  UseBefore,
} from 'routing-controllers';
import {Repository} from 'typeorm';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {CreateUserDto} from '../helpers/dtos/models/User/create-user.dto';
import {UpdateUserDto} from '../helpers/dtos/models/User/update-user.dto';
import {ValidateBody} from '../middlewares/validate-body.middleware';
import {PermissionLevel} from '../models/permission-level.model';
import {UserProfile} from '../models/user-profile.model';
import {User} from '../models/user.model';

@JsonController('/api/v1/users')
export default class UsersController {
  constructor(
    @InjectRepository(PermissionLevel)
    private readonly permLevelRepo: Repository<PermissionLevel>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly userProfileRepo: Repository<UserProfile>,
  ) {}

  @Get('/')
  @Authorized()
  async index(): Promise<Partial<User>[]> {
    return (await this.userRepo.find()).map(user =>
      _.pick(user, [
        'id',
        'email',
        'profile',
        'permissionLevel',
      ] as (keyof User)[]),
    );
  }

  @Get('/:id')
  @Authorized()
  async show(@Param('id') id: number): Promise<User> {
    throw new MethodNotAllowedError('TODO: Method not yet implemented');
  }

  @Post('/')
  @HttpCode(201)
  @UseBefore(ValidateBody(CreateUserDto))
  async create(
    @Body({required: true})
    createUser: CreateUserDto,
  ): Promise<Partial<User> | void> {
    const profile = await this.userProfileRepo.save(
      await this.userProfileRepo.create({...createUser.profile}),
    );

    const userData = this.userRepo.create({
      ...createUser,
      profile,
      permissionLevel: await this.permLevelRepo.findOneOrFail(
        createUser.permissionLevelId,
      ),
    });

    try {
      const user = await this.userRepo.save(userData);

      return _.pick(user, [
        'id',
        'email',
        'profile',
        'permissionLevel',
      ] as (keyof User)[]);
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
      console.error(err);
      throw err;
    }
  }

  @Patch('/:id')
  @Authorized()
  @UseBefore(ValidateBody(UpdateUserDto))
  async update(
    @Param('id') id: string,
    @Body({required: true})
    user: UpdateUserDto,
  ): Promise<Partial<User> | void> {
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

  @Delete('/:id')
  @Authorized()
  async destroy(@Param('id') id: number): Promise<User> {
    throw new MethodNotAllowedError('TODO: Method not yet implemented');
  }
}
