import { ForbiddenException, Injectable } from "@nestjs/common";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable({})
export class AuthService {
    constructor(private prisma: PrismaService) {}
    
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

            //remove the hash from the response
            delete user.hash;

            //and return the saved user as a response.
            return user;
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
        //then, if user does not exist, throw an exception

        //compare passwords
        //if password is incorrect, throw an exception

        //send back the user.

    }
}