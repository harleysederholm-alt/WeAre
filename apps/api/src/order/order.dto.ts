import { IsString, IsNotEmpty, IsDateString, IsArray, ValidateNested, IsNumber, Min, IsEnum, IsEmail, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @Min(0.1)
    quantity: number;

    @IsString()
    @IsNotEmpty()
    unit: string; // e.g., 'kg', 'l', 'kpl'

    @IsString()
    @IsOptional()
    notes?: string;
}

export class OrderRequestDto {
    @IsString()
    @IsNotEmpty()
    restaurantId: string;

    @IsString()
    @IsNotEmpty()
    category: string; // e.g., 'Alcohol', 'Food', 'Cleaning'

    @IsString()
    @IsNotEmpty()
    supplier: string;

    // In a real app, this might come from config, but here we allow user entry or preset
    @IsEmail()
    @IsNotEmpty()
    recipientEmail: string;

    @IsDateString()
    @IsOptional()
    deliveryDate?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];
}
