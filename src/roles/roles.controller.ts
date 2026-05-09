import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guards';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-role';


@Controller('roles')
export class RolesController {

    constructor(private readonly rolesService: RolesService) {}

    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @HasRoles(JwtRole.ADMIN)
    @Post()
    async create(@Body() createRolDto: CreateRolDto) {
        return this.rolesService.create(createRolDto);
    }

}
