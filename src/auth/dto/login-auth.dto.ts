import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginAuthDto {

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string = '';

    @IsNotEmpty()
    @IsString()
    password: string = '';
}