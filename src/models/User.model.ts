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
  getRepository,
} from 'typeorm';
import BcryptService from '../services/bcrypt.service';
import JwtService from '../services/jwt.service';
import {IsUnique} from '../helpers/decorators/is-unique.decorator';

export enum UserValidationGroups {
  DEFAULT = 'DEFAULT',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({nullable: false, unique: true})
  @IsString()
  @IsAlphanumeric()
  @MinLength(2)
  @IsUnique(User)
  userName: string;

  @Column({nullable: false})
  @IsString()
  @MinLength(2)
  firstName: string;

  @Column({nullable: false})
  @IsString()
  @MinLength(2)
  lastName: string;

  @Column({nullable: false, unique: true})
  @IsEmail()
  @IsUnique(User)
  email: string;

  @Column({nullable: true})
  @Length(6, 72)
  password: string;

  @Column()
  @IsString()
  passwordToken: string;

  @Column({nullable: false, default: false})
  @IsBoolean()
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
