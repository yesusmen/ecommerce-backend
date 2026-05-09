import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto as user } from './dto/create-user.dto';
import bcrypt from 'node_modules/bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ) {}
    
    create(user: user): Promise<User> {
        const passHash = bcrypt.hashSync(user.password, 10); // In a real application, you should hash the password before saving
        const newUser = this.userRepository.create({ ...user, password: passHash });
        return this.userRepository.save(newUser);
    }

    findAll(): Promise<User[]> {
        return this.userRepository.find({
            relations: ["roles"]
        });
    }

    async update(id: number, user: UpdateUserDto) {
        const userFound = await this.userRepository.findOne({ where: { id }, relations: ["roles"] });
        if (!userFound) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const updatedUser = Object.assign(userFound, user);
        return this.userRepository.save(updatedUser);
    }

    // Upload user avatar
    async updateWithImage(id: number, file: Express.Multer.File) {

        // Check if user exists
        const userFound = await this.userRepository.findOne({ where: { id }, relations: ["roles"] });
        if (!userFound) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        // Validate file presence and type
        if (!file) {
            throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
        }

        // validate file type (e.g., only allow jpeg and png)
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          throw new HttpException('Invalid file type', HttpStatus.BAD_REQUEST);
        }

        // validate file size (e.g., max 2mb)
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
          throw new HttpException('File is too large', HttpStatus.BAD_REQUEST);
        }
        
        // Save the filename in the database and return the user with the new image URL
        userFound.image = `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}/image/avatars/${file.filename}`; 
        // hidden the password before returning the user
        userFound.password = undefined as unknown as string;
        return this.userRepository.save(userFound);
    
    }

}