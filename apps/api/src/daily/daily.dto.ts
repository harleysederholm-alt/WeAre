import { IsString, IsNotEmpty, IsDateString, IsArray, ValidateNested, IsNumber, Min, IsEnum, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export class SaleItemDto {
    @IsString()
    @IsNotEmpty()
    category: string;

    @IsNumber()
    @Min(0)
    amount: number;

    @IsNumber()
    @Min(0)
    tax: number;
}

export enum ShiftType {
    NORMAALI = 'Normaali',
    POISSA = 'Poissa',
    MUU = 'Muu'
}

export class ShiftItemDto {
    @IsString()
    @IsNotEmpty()
    name: string; // Employee ID or Name

    @IsEnum(ShiftType)
    type: ShiftType;

    @ValidateIf(o => o.type !== ShiftType.POISSA)
    @IsString()
    start: string; // HH:mm

    @ValidateIf(o => o.type !== ShiftType.POISSA)
    @IsString()
    end: string; // HH:mm

    @IsNumber()
    @Min(0)
    hours: number;
}

export class DailyReportDto {
    @IsString()
    @IsNotEmpty()
    restaurantId: string;

    @IsDateString()
    @IsNotEmpty()
    date: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SaleItemDto)
    sales: SaleItemDto[];

    @IsNumber()
    @Min(0)
    cashTips: number;

    @IsNumber()
    @Min(0)
    voucherCount: number;

    @IsNumber()
    @Min(0)
    voucherValue: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ShiftItemDto)
    shifts: ShiftItemDto[];
}
