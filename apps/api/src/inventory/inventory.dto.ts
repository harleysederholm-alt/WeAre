import { IsString, IsNotEmpty, IsDateString, IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class InventoryItemDto {
    @IsString()
    @IsNotEmpty()
    itemId: string;

    @IsNumber()
    @Min(0)
    quantity: number;
}

export class InventoryCountDto {
    @IsString()
    @IsNotEmpty()
    restaurantId: string;

    @IsDateString()
    @IsNotEmpty()
    date: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InventoryItemDto)
    items: InventoryItemDto[];
}
