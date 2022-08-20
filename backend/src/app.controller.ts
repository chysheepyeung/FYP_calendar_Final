import { AppService } from '@/app.service';
import { Controller, Get, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService // private authService: AuthService
  ) {}

  // @UseGuards(LocalAuthGuard)
  // @Post('login')
  // async login(@Request() req) {
  //   return this.authService.loginWithCredentials(req.user);
  // }

  @Get('version')
  async getVersion() {
    return this.appService.getVersion();
  }

  @MessagePattern(process.env.npm_package_name)
  @Get(AppController.prototype.health.name)
  health() {
    return 'OK';
  }
}
