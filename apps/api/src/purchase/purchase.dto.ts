import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class IngestEmailDto {
    @IsString()
    @IsNotEmpty()
    sender: string;

    @IsString()
    @IsNotEmpty()
    subject: string;

    @IsString()
    @IsNotEmpty()
    body: string;
}

export class ParsedItemDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    ean?: string;

    @IsNumber()
    quantity: number;

    @IsNumber()
    unitPrice: number;

    @IsNumber()
    total: number;
}

export class ConfirmPurchaseDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ParsedItemDto)
    items: ParsedItemDto[];

    @IsDateString()
    date: string;
}

export enum PurchaseStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    REJECTED = 'REJECTED'
}
