import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray } from 'class-validator';

export enum HelpLayer {
    GLOBAL = 'GLOBAL',
    FRANCHISE = 'FRANCHISE',
    UNIT = 'UNIT'
}

export class CreateHelpArticleDto {
    @IsString()
    @IsNotEmpty()
    contextKey: string; // e.g. 'daily_sales', 'waste_meat'

    @IsEnum(HelpLayer)
    layer: HelpLayer;

    @IsString()
    @IsOptional()
    restaurantId?: string; // Required if layer is UNIT

    // Finnish Content
    @IsString()
    @IsNotEmpty()
    title_fi: string;

    @IsString()
    @IsNotEmpty()
    body_fi: string;

    @IsArray()
    @IsOptional()
    steps_fi?: string[];

    // English Content
    @IsString()
    @IsNotEmpty()
    title_en: string;

    @IsString()
    @IsNotEmpty()
    body_en: string;

    @IsArray()
    @IsOptional()
    steps_en?: string[];

    @IsArray()
    @IsOptional()
    tags?: string[];
}

export class SearchHelpDto {
    @IsString()
    @IsOptional()
    context?: string;

    @IsString()
    @IsOptional()
    query?: string;

    @IsString()
    @IsOptional()
    restaurantId?: string;
}
