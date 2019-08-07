import {IsDefined, IsEmail, IsString, Length} from 'class-validator';

export class AuthDto {
  @IsDefined()
  @IsString()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsString()
  @Length(6, 72)
  password: string;
}
