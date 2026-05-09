
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'node_modules/bcryptjs';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Rol } from 'src/roles/role.entity';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Rol) private roleRepository: Repository<Rol>,
        private jwtService: JwtService
    ) {}

    async validateUser(email: string, password: string): Promise<User | null> {

        const user = await this.userRepository.findOne({ where: { email } });
        if (user && bcrypt.compareSync(password, user.password)) { // In a real application, you should compare hashed passwords
            return user;
        }
        return null;
    }

    async login(loginData: LoginAuthDto): Promise<{ accessToken: string; user: User }> {

        const emailExistingUser = await this.userRepository.findOne({ 
            where: { 
                email: loginData.email 
            },
            relations: ['roles'] // Ensure roles are loaded with the user 
        });
        if (!emailExistingUser) {
            throw new HttpException('Credenciales no validas', HttpStatus.CONFLICT);
        }

        const passwordValid = await bcrypt.compare(loginData.password, emailExistingUser.password);
        if (!passwordValid) {
            throw new HttpException('Credenciales no validas', HttpStatus.CONFLICT);
        }

        const RolesIds = emailExistingUser.roles.map(role => role.id);

        const payload = { 
            id: emailExistingUser.id, 
            name: emailExistingUser.firstName + ' ' + emailExistingUser.lastName, 
            roles: RolesIds 
        };
        const accessToken = 'Bearer ' + this.jwtService.sign(payload);
        
        // Add Token JWT UsersController
        const userToken = await this.userRepository.update(emailExistingUser.id, { notification_token: accessToken });

        const userUpdate = await this.userRepository.findOne({ 
            where: { id: emailExistingUser.id }, 
            relations: ['roles'] 
        });

        const userLogeado = { ...userUpdate };
        delete userLogeado?.password; // Remove the password field from the user object before returning it
        
        return { accessToken, user: userLogeado as User };
    }
   
    
    async register(user: RegisterAuthDto){

        // Check if the user already exists
        const existingUser = await this.userRepository.findOneBy({ email: user.email });
        if (existingUser) {
            throw new HttpException('Usuario con este correo electrónico ya existe', HttpStatus.CONFLICT);
        }
       
        // Check if the phone number already exists
        const existingPhone = await this.userRepository.findOne({ where: { phone: user.phone } });
        if (existingPhone) {
            throw new HttpException('Usuario con este número de teléfono ya existe', HttpStatus.CONFLICT);
        }

        // Find Rol by name "User"
        const userRole = await this.roleRepository.findOne({ where: { id: 'CLIENT' } });
        if (!userRole) {
            throw new HttpException('Rol CLIENT no encontrado', HttpStatus.NOT_FOUND);
        }

        const newUser = this.userRepository.create({ ...user, roles: [userRole] });
        const savedUser = await this.userRepository.save(newUser);

        const RolesIds = savedUser.roles.map(role => role.id);

        // Add Token JWT UsersController
        const payload = { 
            id: savedUser.id, 
            name: savedUser.firstName + ' ' + savedUser.lastName, 
            email: savedUser.email, 
            roles: RolesIds 
        };
        
        const accessToken = 'Bearer ' + this.jwtService.sign(payload);
        const userToken = await this.userRepository.update(savedUser.id, { notification_token: accessToken });

        const { password, ...result } = savedUser;
        return { accessToken, result };
    }

}
