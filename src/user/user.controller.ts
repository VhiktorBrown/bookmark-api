import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {

    @UseGuards(AuthGuard('jwt'))
    @Get('myProfile')
    getMyProfile(){
        return 'My profile';
    }
}
