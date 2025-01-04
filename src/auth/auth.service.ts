import { ForbiddenException, Injectable } from "@nestjs/common";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable({})
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
    ) {}
    
    async signUp(dto: AuthDto){
        //first hash user's password.
        const hash = await argon.hash(dto.password);

        try {
            //then, save user in the database.
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                }
            });

            //and return the saved user as a response.
            return this.signToken(user.id, user.email);
        }catch(error){
            if(error 
                instanceof 
                PrismaClientKnownRequestError){
                if(error.code == 'P2002'){
                    throw new ForbiddenException(
                        'Account already exists');
                }
            }
            throw error;
        }
        
    }

    async signIn(dto: AuthDto){
        //first, find the user
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            }
        });
        //then, if user does not exist, throw an exception
        if(!user){
            throw new ForbiddenException(
                'Invalid login credentials'
            );
        }

        //compare passwords
        const pwMatches = await argon.verify(
            user.hash,
            dto.password,);
        //if password is incorrect, throw an exception
        if(!pwMatches){
            throw new ForbiddenException(
                'Invalid login credentials'
            );
        }

        //send back the auth token.
        return this.signToken(user.id, user.email);
    }

    //function to generate our auth token.
    async signToken(
        userId: number, 
        email: string) : Promise<{}>{
        //create the payload that we want to sign
         const payload = {
            sub: userId,
            email: email,
         }
         //fetch the token from our env
         const secret = this.config.get('JWT_SECRET');
         //sign the payload and generate our token.
         const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: secret,
         });
         //return our access token.
         return {
            "access_token": token,
         };
    }
}