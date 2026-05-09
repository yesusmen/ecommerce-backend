import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtRole } from "./jwt-role";
import { Reflector } from "@nestjs/core";

@Injectable()
export class JwtRolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<JwtRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
        return true;
    }
        const { user } = context.switchToHttp().getRequest();
        return requiredRoles.some(role => user.roles?.includes(role));
    }
}
