import Container from 'typedi';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  getConnection,
} from 'typeorm';
import BcryptService from '../services/bcrypt.service';
import JwtService from '../services/jwt.service';
import {UserProfile} from './user-profile.model';
import {PermissionLevel} from './permission-level.model';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({nullable: false, unique: true})
  email: string;

  @Column({nullable: true})
  password: string;

  @Column({nullable: true})
  passwordToken: string;

  @OneToOne(type => UserProfile, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  profile: UserProfile;

  @ManyToOne(
    type => PermissionLevel,
    permissionLevel => permissionLevel.users,
    {nullable: false},
  )
  permissionLevel: PermissionLevel;

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
    this.passwordToken = await this.jwtService.sign(
      {
        id: this.id,
        profile: await this.profile,
      },
      '1d',
    );
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    try {
      const user = await getConnection()
        .getRepository(User)
        .findOneOrFail(this.id);
      if (this.password === user.password) {
        return;
      }
      // eslint-disable-next-line no-empty
    } catch (err) {}

    if (this.password)
      this.password = await this.bcryptService.hash(this.password);
  }

  async checkPassword(password: string): Promise<boolean> {
    if (!this.password) return false;
    return this.bcryptService.compare(password, this.password);
  }
}
