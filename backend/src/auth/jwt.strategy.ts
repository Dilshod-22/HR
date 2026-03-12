import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EmployeesService } from '../employees/employees.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly employeesService: EmployeesService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'crud-full-secret-change-in-prod',
    });
  }

  async validate(payload: { sub: string; login: string }) {
    const employee = await this.employeesService.findById(payload.sub);
    if (!employee) throw new UnauthorizedException();
    return { id: employee.id, login: employee.login, firstName: employee.firstName, lastName: employee.lastName };
  }
}
