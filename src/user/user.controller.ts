import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService){}

    @Get('myProfile')
    getMyProfile(@GetUser() user: User){
        return user;
    }

    @Patch()
    editProfile(
        @GetUser('id') userId: number,
        @Body() dto: EditUserDto,)
         {
            console.log(userId);
        return this.userService.editProfile(
            userId, dto
        );

    }
}
