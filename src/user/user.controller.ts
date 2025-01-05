import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {

    @Get('myProfile')
    getMyProfile(@GetUser() user: User){
        return user;
    }
}
