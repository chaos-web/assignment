import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { PaginationDto } from "../../common.interface";

export class CreateOfferDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  company: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  minSalary: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  maxSalary: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  issuedAt: Date;
}

export class UpdateOfferDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;
}



export class FindOfferDto  extends PaginationDto{
  @ApiProperty()
  @IsOptional()
  @IsString()
  search: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  location: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  minSalary: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  maxSalary: number;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  issuedFrom: Date;
}