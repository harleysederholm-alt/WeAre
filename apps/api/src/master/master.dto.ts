import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber } from 'class-validator';

export enum IssueType {
    MISSING_ITEM = 'MISSING_ITEM',
    WRONG_EAN = 'WRONG_EAN',
    WRONG_NAME = 'WRONG_NAME',
    WRONG_PRICE = 'WRONG_PRICE',
    OTHER = 'OTHER'
}

export enum SuggestionStatus {
    NEW = 'NEW',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

export class CreateSuggestionDto {
    @IsString()
    @IsNotEmpty()
    restaurantId: string;

    @IsString()
    @IsOptional()
    targetItemId?: string; // If editing an existing item

    @IsString()
    @IsNotEmpty()
    itemName: string;

    @IsEnum(IssueType)
    issueType: IssueType;

    @IsString()
    @IsOptional()
    suggestedValue?: string; // The new name, new EAN, etc.

    @IsString()
    @IsOptional()
    ean?: string;

    @IsString()
    @IsOptional()
    comment?: string;
}

export class ResolveSuggestionDto {
    @IsString()
    @IsNotEmpty()
    suggestionId: string;

    @IsEnum(SuggestionStatus)
    action: SuggestionStatus; // APPROVED or REJECTED

    @IsString()
    @IsOptional()
    adminComment?: string;
}
