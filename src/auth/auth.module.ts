import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "src/prisma/prisma.module";
 
@Module({
    imports: [JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}