import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { VisitService } from './visit.service';
import { VisitController } from './visit.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { LoggerMiddleware } from 'src/user/logger/logger.middleware';

@Module({
  imports: [
    JwtModule.register({
      secret: 'AjsuYskd09_QSjhHO875@j/kskJJSA0',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [VisitController],
  providers: [VisitService, PrismaService],
})
export class VisitModule implements NestModule {
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