import { Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/user.dto';
import { AuthDto } from './dto/auth.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from './guards/auth/auth.guard';

@Controller('user')
export class UserController {

  constructor(private userService: UserService) {}

  @Get('users')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getUser() {
    return this.userService.getUsers();
  }

  @Post('register')
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, description: 'User  created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  createUser (@Body() user: RegisterDto) {
    return this.userService.createUser (user);
  }

  @Post('login')
  @ApiOperation({ summary: 'User  login' })
  @ApiResponse({ status: 200, description: 'User  logged in successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  login(@Body() AuthDto: AuthDto) {
    return this.userService.login(AuthDto);
  }
  // login(@Body() loginDto: LoginDto) {
  //   return this.userService.login(loginDto);
  // }

  
}
