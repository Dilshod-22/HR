import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmployeesService } from '../employees/employees.service';

const AUTH_INVALID_CREDENTIALS = 'Login yoki parol noto‘g‘ri';

@Injectable()
export class AuthService {
  constructor(
    private readonly employeesService: EmployeesService,
    private readonly jwtService: JwtService,
  ) {}

  async login(login: string, password: string) {
    const employee = await this.employeesService.findByLogin(login);
    if (!employee) throw new UnauthorizedException(AUTH_INVALID_CREDENTIALS);
    const valid = await this.employeesService.validatePassword(password, employee.passwordHash);
    if (!valid) throw new UnauthorizedException(AUTH_INVALID_CREDENTIALS);
    const payload = { sub: employee.id, login: employee.login };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      employee: {
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        login: employee.login,
      },
    };
  }
}
