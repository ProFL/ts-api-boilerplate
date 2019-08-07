import {ParameterizedContext} from 'koa';
import {User} from '../../models/user.model';

export interface CustomAppState {
  user?: User;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CustomKoaExtensions {}

export type KoaContext = ParameterizedContext<
  CustomAppState,
  CustomKoaExtensions
>;
