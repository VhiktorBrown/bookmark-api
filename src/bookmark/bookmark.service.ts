import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
    constructor(private prisma: PrismaService){}

    //creates bookmark
    async createBookmark(
        userId: number,
        dto: BookmarkDto
    ) {
        try {
            //create bookmark and add the userId
            const bookmark = await this.prisma.bookmark.create({
                data: {
                    title: dto.title,
                    description: dto.description,
                    userId: userId,
                    link: dto.link,
                }
            });

            delete bookmark.userId;

            //return bookmark
            return bookmark;
        }catch(err){
            console.log(err);
            throw err;
        }
    }

    //get all bookmarks
    async getBookmarks(
        userId: number,
    ) {
        //use the ID to fetch associated bookmarks.
        const bookmarks = await this.prisma.bookmark.findMany({
            where: {
                userId: userId
            },
            select: {
                id: true,
                title: true,
                description: true,
                link: true,
                createdAt: true,
            }
        });

        //return bookmarks
        return { bookmarks };
    }

    //fetch a single bookmark
    async getBookmark(
        userId: number,
        bookmarkId: number,
    ) {
        try {
            //use both bookmark ID and user ID to fetch the bookmark
            const bookmark = await this.prisma.bookmark.findFirst({
                where: {
                    userId: userId,
                    id: bookmarkId,
                }
            });

            //if not found, throws error
            if(!bookmark){
                throw new ForbiddenException();
            }

            //remove userId from the response
            delete bookmark.userId;

            return { bookmark };
        }catch(err){
            throw err;
        }
    }

     //edit a single bookmark
     async editBookmark(
        userId: number,
        bookmarkId: number,
        dto: BookmarkDto,
    ) {
        try {
            //check to make sure that the bookmark ID is even valid.
            const bookmark = await this.prisma.bookmark.findFirst({
                where: {
                    userId: userId,
                    id: bookmarkId,
                }
            });

            //if it does not exist, throw an error
            if(!bookmark){
                throw new ForbiddenException();
            }

            //update the bookmark
            const updatedBookmark = await this.prisma.bookmark.update({
                where: {
                    id: bookmarkId
                },
                data: {
                    ...dto,
                }
            });

            //remove the userId
            delete updatedBookmark.userId;

            return { bookmark: updatedBookmark};

        }catch(err){
            throw err;
        }
    }

    //delete a bookmark
    async deleteBookmark(
        userId: number,
        bookmarkId: number,
    ){
        //check to see if it exists
        const bookmark = await this.prisma.bookmark.findFirst({
            where: {
                userId: userId,
                id: bookmarkId,
            }
        });

        //if it does not exist,
        if(!bookmark){
            throw new ForbiddenException();
        }

        //then, delete
        const deletedBookmark = this.prisma.bookmark.delete({
            where: {
                id: bookmarkId
            }
        });

        return {
            "status": true,
            "message": "Bookmark successfully deleted"
        };
    }
}
