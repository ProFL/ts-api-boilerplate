import {Column, Entity, OneToMany, PrimaryColumn} from 'typeorm';
import {User} from './user.model';

@Entity()
export class PermissionLevel {
  @PrimaryColumn()
  id: number;

  @Column({unique: true, nullable: false})
  name: string;

  @OneToMany(type => User, user => user.permissionLevel, {lazy: true})
  users: Promise<User[]>;
}
