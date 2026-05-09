import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rol } from './role.entity';
import { Repository } from 'typeorm';
import { CreateRolDto } from './dto/create-rol.dto';

@Injectable()
export class RolesService {

    constructor(@InjectRepository(Rol) private readonly rolRepository: Repository<Rol>) { }


    async create(rol: CreateRolDto): Promise<Rol> {
        const newRol = await this.rolRepository.create(rol);
        return this.rolRepository.save(newRol);
    }


}
