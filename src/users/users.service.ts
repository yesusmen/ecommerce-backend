import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto as user } from './dto/create-user.dto';
import bcrypt from 'node_modules/bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}
    
    create(user: user): Promise<User> {
        const passHash = bcrypt.hashSync(user.password, 10); // In a real application, you should hash the password before saving
        const newUser = this.userRepository.create({ ...user, password: passHash });
        return this.userRepository.save(newUser);
    }

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async update(id: number, user: UpdateUserDto) {
        const userFound = await this.userRepository.findOneBy({ id });
        if (!userFound) {
            return new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const updatedUser = Object.assign(userFound, user);
        return this.userRepository.save(updatedUser);
    }

}