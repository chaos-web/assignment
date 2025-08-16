import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { State } from "../entities/signal.entity";


export class SignalPayload {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  time: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  speed: number;
}

export class CreateSignalDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  deviceId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SignalPayload)
  payload: Array<SignalPayload>;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  time: number;
}

export class UpdateSignalDto {
  @ApiProperty({ enum: State })
  @IsOptional()
  @IsEnum(State)
  state: State;
}

export class FindSignalDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  deviceId: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  startTime: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  endTime: number;
}