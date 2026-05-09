import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MinLength } from "class-validator";

export class RegisterAuthDto {

    @IsNotEmpty()
    @IsString()
    firstName: string = '';

    @IsNotEmpty()
    @IsString()
    lastName: string = '';

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string = '';

    @IsNotEmpty()
    @IsString()
    @IsPhoneNumber() // You can specify a locale if you want to validate specific phone number formats
    phone: string = '';

    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' }) // You can specify a minimum length for the password
    password: string = ''; 
    
    rolesIds: string[];

}     