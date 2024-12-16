import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ResidentService } from './resident.service';
import { ResidentController } from './resident.controller';
import { LoggerMiddleware } from 'src/user/logger/logger.middleware';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'AjsuYskd09_QSjhHO875@j/kskJJSA0',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [ResidentController],
  providers: [
    ResidentService,
    PrismaService
  ],
})
export class ResidentModule implements NestModule {
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