import {
  IsAlphanumeric,
  IsBoolean,
  IsDefined,
  IsEmail,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import Container from 'typedi';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import BcryptService from '../services/bcrypt.service';
import JwtService from '../services/jwt.service';

export type UserValidationGroups = 'default' | 'create' | 'update';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({nullable: false, unique: true})
  @IsDefined({groups: ['create'] as UserValidationGroups[]})
  @IsString({groups: ['default'] as UserValidationGroups[]})
  @IsAlphanumeric({groups: ['default'] as UserValidationGroups[]})
  @MinLength(2, {groups: ['default'] as UserValidationGroups[]})
  userName: string;

  @Column({nullable: false})
  @IsDefined({groups: ['create'] as UserValidationGroups[]})
  @IsString({groups: ['default'] as UserValidationGroups[]})
  @MinLength(2, {groups: ['default'] as UserValidationGroups[]})
  firstName: string;

  @Column({nullable: false})
  @IsDefined({groups: ['create'] as UserValidationGroups[]})
  @IsString({groups: ['default'] as UserValidationGroups[]})
  @MinLength(2, {groups: ['default'] as UserValidationGroups[]})
  lastName: string;

  @Column({nullable: false, unique: true})
  @IsDefined({groups: ['create'] as UserValidationGroups[]})
  @IsEmail(undefined, {groups: ['default'] as UserValidationGroups[]})
  email: string;

  @Column({nullable: true})
  @IsDefined({groups: ['update'] as UserValidationGroups[]})
  @Length(6, 72, {groups: ['default'] as UserValidationGroups[]})
  password: string;

  @Column()
  @IsString({groups: ['default'] as UserValidationGroups[]})
  passwordToken: string;

  @Column({nullable: false, default: false})
  @IsDefined({groups: ['create'] as UserValidationGroups[]})
  @IsBoolean({groups: ['default'] as UserValidationGroups[]})
  isAdmin: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  private readonly jwtService: JwtService;

  private readonly bcryptService: BcryptService;

  constructor() {
    this.jwtService = Container.get(JwtService);
    this.bcryptService = Container.get(BcryptService);
  }

  @BeforeInsert()
  async generatePasswordToken(): Promise<void> {
    this.passwordToken = (await this.jwtService.sign(
      {
        id: this.id,
        firstName: this.firstName,
        lastName: this.lastName,
      },
      '1d',
    )) as string;
  }

  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    this.password = await this.bcryptService.hash(this.password);
  }

  async checkPassword(password: string): Promise<boolean> {
    return this.bcryptService.compare(password, this.password);
  }
}
