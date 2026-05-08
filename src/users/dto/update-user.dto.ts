import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class UpdateUserDto {
    @IsNotEmpty()
    @IsString()
    firstName?: string;

    @IsNotEmpty()
    @IsString()
    lastName?: string;
    
    @IsNotEmpty()
    @IsString()
    @IsPhoneNumber()
    phone?: string;

    @IsString()
    image?: string;

    @IsString()
    access_token?: string;
}