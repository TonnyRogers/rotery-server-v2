import { LocationType } from "@/entities/location.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateLocationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty()
  locationJson: Record<string, unknown>;

  @ApiProperty()
  @IsEnum(LocationType)
  type: LocationType;
}