import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { BookmarkDto, UpdateBookmarkDto } from './dto';
import { BookmarkService } from './bookmark.service';
import { JwtGuard } from '../auth/guard/jwt.guard';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    constructor(private bookmarkService: BookmarkService){}

    //create a bookmark endpoint.
    @Post()
    createBookmark(
        @GetUser('id') userId: number,
        @Body() dto: BookmarkDto){
            console.log(dto.title);
            console.log(dto.description);
            return this
            .bookmarkService.createBookmark(
                userId,
                dto,
            );
    }

    //Fetch user's bookmarks
    @Get()
    getBookmarks(
        @GetUser('id') userId: number,
    ) {
        return this.bookmarkService.getBookmarks(
            userId);
    }

    //Get single bookmark endpoint
    @Get(':id')
    getBookmark(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) bookmarkId: number
    ) {
        return this.bookmarkService.getBookmark(
            userId,
            bookmarkId,
        );
    }

    //Get single bookmark endpoint
    @Patch(':id')
    editBookmark(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) bookmarkId: number,
        @Body() dto: UpdateBookmarkDto,
    ) {
        return this.bookmarkService.editBookmark(
            userId,
            bookmarkId,
            dto,
        );
    }

    //Delete bookmark endpoint
    @Delete(':id')
    deleteBookmark(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) bookmarkId: number,
    ) {
        return this.bookmarkService.deleteBookmark(
            userId,
            bookmarkId,
        );
    }
}
