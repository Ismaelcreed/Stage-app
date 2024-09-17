import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PoliceModule } from './police/police.module';
import { DriverModule } from './driver/driver.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { QRCodeModule } from './qrcode/qrcode.module';
import { ViolationsModule } from './violations/violations.module';
import { PayementsModule } from './payements/payements.module';
import { UploadModule } from './upload/upload.module';
import { JwtMiddleware } from './user/jwt.middleware';
import { JwtService } from '@nestjs/jwt';
import { GraphQLContext } from './user/resolver/graphql.context';
import { Request } from 'express';
import { StatsModule } from './stats.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({ req }: { req: Request }) => ({ req } as GraphQLContext),
      path: '/graphql',
    }),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/gestion_des_infractions_routieres'),
    UserModule,
    PoliceModule,
    DriverModule,
    VehiclesModule,
    QRCodeModule,
    ViolationsModule,
    PayementsModule,
    UploadModule,
    StatsModule
  ],
  controllers: [AppController],
  providers: [AppService , JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes('*'); 
  }
}
