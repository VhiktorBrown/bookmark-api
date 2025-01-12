import { IsNotEmpty, IsString } from "class-validator";

export class BookmarkDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsString()
    link: string;
}