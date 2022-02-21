import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { EmailHelpRequestTypeTypes } from "utils/types";

export class CreateHelpRequestDto {
    @ApiProperty()
    data?: Record<string, any>;

    @ApiProperty()
    @IsNotEmpty()
    message: string;

    @ApiProperty()
    @IsNotEmpty()
    type: EmailHelpRequestTypeTypes;
}