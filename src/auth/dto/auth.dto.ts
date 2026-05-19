import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class RegisterDto {
    @IsEmail({}, { message: i18nValidationMessage('authMessage.auth.emailNotValid') })
    email: string;

    @IsString()
    @MinLength(6, { message: i18nValidationMessage('authMessage.auth.passwordMustBe') })
    password: string;

    @IsNotEmpty({ message: i18nValidationMessage('authMessage.auth.nameNotEmpty') })
    name: string;
}

export class LoginDto {
    @IsEmail({}, { message: i18nValidationMessage('authMessage.auth.emailNotValid') })
    email: string;

    @IsNotEmpty({ message: i18nValidationMessage('authMessage.auth.passwordNotEmpty') })
    password: string;
}