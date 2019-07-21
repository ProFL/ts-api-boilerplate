import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import bcryptHelper from '../helpers/bcrypt.helper';
import jwtHelper from '../helpers/jwt.helper';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({nullable: false, unique: true})
  userName: string;

  @Column({nullable: false})
  firstName: string;

  @Column({nullable: false})
  lastName: string;

  @Column({nullable: false, unique: true})
  email: string;

  @Column()
  password: string;

  @Column()
  passwordToken: string;

  @Column({nullable: false, default: true})
  isAdmin: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async generatePasswordToken(): Promise<void> {
    this.passwordToken = (await jwtHelper.sign(
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
    this.password = await bcryptHelper.hash(this.password);
  }

  async checkPassword(password: string): Promise<boolean> {
    return bcryptHelper.compare(password, this.password);
  }
}
