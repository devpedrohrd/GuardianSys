import { Injectable } from "@nestjs/common"
import { PrismaService } from "../../../../config/database/Prisma.service";
import { UserNotFoundException } from "../../../user/domain/exceptions";
import { JwtService } from "@nestjs/jwt";
import { MailService } from "../../../mail/mail.service";

@Injectable()
export class ForgotPasswordUseCase {
    constructor(
        private readonly prisma:PrismaService,
        private readonly jwtService:JwtService,
        private readonly mailService:MailService
    ) {}

    async execute(email: string) {
        const user = await this.prisma.user.findFirst({
            where: {
                email: email.toLowerCase()
            }
        })

        if (!user) {
            throw new UserNotFoundException(email)
        }

        const token = this.jwtService.sign(
            { sub: user.id, email: user.email },
            { secret: process.env.JWT_SECRET || 'fallback-secret', expiresIn: '15m' }
        )

        await this.mailService.sendForgotPasswordEmail(user.email, token)
    }
}