import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(
    Strategy,
    'jwt' // specifies the guard type to use. Could be 'jwt2' or some other one
) {
    constructor(
        private config: ConfigService,
        private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET')
        })
    }

    async validate(payload: any){
        //first get the id
        const userId = payload.sub;

        //then, check if it exists in the DB
        const user = await this.prisma.user.findUnique({
            where : {
                id: userId
            }
        });

        //remove hash
        delete user.hash;

        //return user
        return user;
    }
}