import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtRole } from 'src/auth/jwt/jwt-role';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guards';
import { HasRoles } from 'src/auth/jwt/has-roles';

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {}

    @Post()
    create(@Body() user: CreateUserDto) {
        return this.usersService.create(user);
    }

    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @HasRoles(JwtRole.ADMIN)
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @Put(':id')
    update(@Param("id", ParseIntPipe) id: number, @Body() user: UpdateUserDto) {
        return this.usersService.update(id, user);
    }


    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @Post('upload/:id')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@Param("id", ParseIntPipe) id: number, 
    @UploadedFile(
        new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }), // 2MB   
        ],
    }),
    ) file: Express.Multer.File) {
        //console.log(file)
        return this.usersService.updateWithImage(id, file);
    }

}
