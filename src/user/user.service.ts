import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
    ){}

    async editProfile(
        userId: number,
        dto: EditUserDto,){
        //update Database with DTO
        const updatedUser = await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                ...dto
            }
        });

        //remove hash
        delete updatedUser.hash;

        //return user 
        return updatedUser

    }
}
