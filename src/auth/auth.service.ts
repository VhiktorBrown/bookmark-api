import { Injectable } from "@nestjs/common";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaService } from "src/prisma/prisma.service";

@Injectable({})
export class AuthService {
    constructor(private prisma: PrismaService) {}
    
    async signUp(dto: AuthDto){
        //first hash user's password.
        const hash = await argon.hash(dto.password);

        //then, save user in the database.
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                hash,
            }
        });

        //remove the hash from the response
        delete user.hash;

        //and return the saved user as a response.
        return user;
    }

    signIn(){
        return {message: 'I am signed in'};
    }
}