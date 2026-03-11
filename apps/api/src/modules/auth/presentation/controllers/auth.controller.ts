import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseFilters,
  Res,
  Get,
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { LoginUseCase, ForgotPasswordUseCase, ResetPasswordUseCase } from '../../application/use-cases'
import { LoginDto } from '../dtos'
import { AuthExceptionFilter } from '../filters'
import { Response } from 'express'
import { ForgotPasswordDto } from '../dtos/forgot-password.dto'
import { ResetPasswordDto } from '../dtos/reset-password.dto'

@ApiTags('Auth')
@Controller('auth')
@UseFilters(AuthExceptionFilter)
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autenticar usuário e obter JWT' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @ApiResponse({ status: 403, description: 'Empresa inativa' })
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.loginUseCase.execute(dto)

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    })
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.status(HttpStatus.OK).json({
      message: 'Login realizado com sucesso',
    })
  }

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deslogar usuário' })
  @ApiResponse({ status: 200, description: 'Usuário deslogado com sucesso' })
  async logout(@Res() res: Response) {
    res.clearCookie('access_token')
    res.clearCookie('refresh_token')
    return res.status(HttpStatus.OK).json({
      message: 'Usuário deslogado com sucesso',
    })
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Esquecer senha' })
  @ApiResponse({ status: 200, description: 'Email enviado com sucesso' })
  @ApiResponse({ status: 404, description: 'Email não encontrado' })
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(@Body() dto: ForgotPasswordDto, @Res() res: Response) {
    await this.forgotPasswordUseCase.execute(dto.email)
    return res.status(HttpStatus.OK).json({
      message: 'Email enviado com sucesso',
    })
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Redefinir senha' })
  @ApiResponse({ status: 200, description: 'Senha redefinida com sucesso' })
  @ApiResponse({ status: 400, description: 'Token inválido ou expirado' })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(@Body() dto: ResetPasswordDto, @Res() res: Response) {
    await this.resetPasswordUseCase.execute(dto.token, dto.newPassword)
    return res.status(HttpStatus.OK).json({
      message: 'Senha redefinida com sucesso',
    })
  }
}
