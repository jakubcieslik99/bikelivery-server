import { IsNotEmpty, IsEnum } from 'class-validator';

export enum GetMonthlyStatsSortEnum {
  ASC = 'oldest',
  DESC = 'newest',
}

export class GetMonthlyStatsDto {
  @IsNotEmpty({ message: 'Sort is required.' })
  @IsEnum(GetMonthlyStatsSortEnum, { message: 'Invalid sort value.' })
  sort: GetMonthlyStatsSortEnum;
}
