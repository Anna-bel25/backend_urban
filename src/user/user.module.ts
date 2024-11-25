import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { LoggerMiddleware } from './logger/logger.middleware';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth/auth.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: 'AjsuYskd09_QSjhHO875@j/kskJJSA0',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService
  ]
})

export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
  consumer.apply(LoggerMiddleware).forRoutes('users');
  //   consumer
  //   .apply(LoggerMiddleware)
  //   .forRoutes(
  //     { path: '/users', method: RequestMethod.GET },
  //     { path: '/users', method: RequestMethod.POST }
  //   )

  //   .apply(AuthMiddleware)
  //   .forRoutes('users');
  }
  
}