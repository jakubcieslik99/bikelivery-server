import { IsNotEmpty, IsNumber, IsString, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

class EnvironmentVariables {
  @IsNotEmpty()
  @IsString()
  ENV: string;

  @IsNotEmpty()
  @IsNumber()
  PORT: number;
  @IsNotEmpty()
  @IsString()
  IP: string;
  @IsNotEmpty()
  @IsString()
  API_URL: string;

  @IsNotEmpty()
  @IsString()
  DATABASE_URL: string;

  @IsNotEmpty()
  @IsString()
  JWT_ACCESS_TOKEN_SECRET: string;
  @IsNotEmpty()
  @IsString()
  JWT_REFRESH_TOKEN_SECRET: string;

  @IsNotEmpty()
  @IsString()
  GOOGLE_DIRECTIONS_API_KEY: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) throw new Error(errors.toString());

  return validatedConfig;
}
