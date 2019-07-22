import {
  IsAlphanumeric,
  IsBoolean,
  IsEmail,
  IsString,
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

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({nullable: false, unique: true})
  @IsString({groups: ['create']})
  @IsAlphanumeric({groups: ['create']})
  @MinLength(2, {groups: ['create']})
  userName: string;

  @Column({nullable: false})
  @IsString({groups: ['create', 'update']})
  @MinLength(2)
  firstName: string;

  @Column({nullable: false})
  @IsString({groups: ['create', 'update']})
  @MinLength(2, {groups: ['create', 'update']})
  lastName: string;

  @Column({nullable: false, unique: true})
  @IsEmail({}, {groups: ['create', 'update', 'authenticate']})
  email: string;

  @Column({nullable: true})
  @MinLength(6, {groups: ['create', 'update', 'authenticate']})
  password: string;

  @Column()
  @IsString({groups: ['update']})
  passwordToken: string;

  @Column({nullable: false, default: false})
  @IsBoolean({groups: ['create', 'update']})
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
