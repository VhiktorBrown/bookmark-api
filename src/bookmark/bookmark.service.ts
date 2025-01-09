import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
    constructor(private prisma: PrismaService){}

    async createBookmark(
        userId: number,
        dto: BookmarkDto
    ) {
        try {
            //create bookmark and add the userId
            const bookmark = this.prisma.bookmark.create({
                data: {
                    title: dto.title,
                    description: dto.description,
                    userId: userId,
                    link: dto.link,
                }
            })

            //return bookmark
            return bookmark;
        }catch(err){
            console.log(err);
            throw err;
        }
        
    }
}
