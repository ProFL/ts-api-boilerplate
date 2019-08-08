import {Transporter} from 'nodemailer';
import Container from 'typedi';
import {
  AfterInsert,
  AfterUpdate,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  getConnection,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {Logger} from 'winston';
import * as nodemailer from 'nodemailer';
import {CONSTANT_KEYS} from '../../helpers/enums/constants.enum';
import BcryptService from '../../services/bcrypt.service';
import JwtService from '../../services/jwt.service';
import {PermissionLevel} from './permission-level.model';
import {UserProfile} from './user-profile.model';
import getEnvSecret from '../../helpers/get-env-secret.helper';

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

  private static sJwtService: JwtService;

  private static sBcryptService: BcryptService;

  private static sMailTransporter: Transporter;

  private static sLogger: Logger;

  private get jwtService(): JwtService {
    if (!User.sJwtService) {
      User.sJwtService = Container.get(JwtService);
    }
    return User.sJwtService;
  }

  private get bcryptService(): BcryptService {
    if (!User.sBcryptService) {
      User.sBcryptService = Container.get(BcryptService);
    }
    return User.sBcryptService;
  }

  private get mailTransporter(): Transporter {
    if (!User.sMailTransporter) {
      User.sMailTransporter = Container.get(CONSTANT_KEYS.MAIL_TRANSPORTER);
    }
    return User.sMailTransporter;
  }

  private get logger(): Logger {
    if (!User.sLogger) {
      User.sLogger = Container.get(CONSTANT_KEYS.LOGGER);
    }
    return User.sLogger;
  }

  @AfterInsert()
  @AfterUpdate()
  private async sendPasswordToken(): Promise<void> {
    if (this.passwordToken) {
      const info = await this.mailTransporter.sendMail({
        from: '"TypeScript API Boilerplate" <ts-api-boilerplate@github.com>',
        to: this.email,
        subject: 'Password recovery token',
        text: `Your password recovery token is ${this.passwordToken}`,
      });

      this.logger.info(JSON.stringify(info));
      if ((await getEnvSecret('NODE_ENV')) !== 'production') {
        const msgUrl = nodemailer.getTestMessageUrl(info);
        if (msgUrl) this.logger.info(`Test message url: ${msgUrl}`);
      }
    }
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
