import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AcceptLanguageResolver, HeaderResolver, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make configuration globally available
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    TodosModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions:{
        path: path.join(__dirname, '/language/'),
        watch: true,
      },
      resolvers: [
        new HeaderResolver(['x-custom-lang']),
        AcceptLanguageResolver,
      ]
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
