import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserService } from './service/user.service';
import { AuthService } from './service/auth.service';
import { AuthResolver } from './resolver/auth.resolver';
import { UserResolver } from './resolver/user.resolver';
import { User, UserSchema } from './schema/user.schema';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { jwtConstants } from './strategy/constants';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [UserService, AuthService, AuthResolver, UserResolver, JwtStrategy, LocalStrategy],
  exports: [UserService, AuthService],
})
export class UserModule {}
