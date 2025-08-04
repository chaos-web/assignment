import { ApiProperty } from "@nestjs/swagger";

export class GetOfferResourceDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;
    
    @ApiProperty()
    company: string;

    @ApiProperty()
    location: string;

    @ApiProperty({
        type: Object,
        properties: {
            min: { type: 'number' },
            max: { type: 'number' },
        },
    })
    salary: {
        min: number;
        max: number;
    };

    @ApiProperty()
    issuedAt: Date;

    @ApiProperty()
    createdAt: Date;
    
}