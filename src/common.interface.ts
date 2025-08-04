import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';



export class PaginationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @IsInt()
  page: number;
}

export const ServiceEventsRabbitAddress = {
  exchange: 'Service-Events',
  type: 'topic',
  routingkeys:{
    harvester: {
        newData:"harvester.new-data",
    },
    product:{
        created:"product.created",
        updated:"product.updated",
        deleted:"product.deleted"
    }
  },
};