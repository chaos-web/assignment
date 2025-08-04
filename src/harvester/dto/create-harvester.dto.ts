import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateHarvesterDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateHarvesterDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;
}

