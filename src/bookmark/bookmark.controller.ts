import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { BookmarkDto } from './dto';
import { BookmarkService } from './bookmark.service';
import { JwtGuard } from '../auth/guard/jwt.guard';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    constructor(private bookmarkService: BookmarkService){}

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
}
