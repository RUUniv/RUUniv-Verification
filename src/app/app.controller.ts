import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller("app")
export class AppController {

  @Get()
  getHello(): string {
    return "hello";
  }
}
