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
  WEBAPP_URL: string;

  @IsNotEmpty()
  @IsString()
  PG_HOST: string;
  @IsNotEmpty()
  @IsNumber()
  PG_PORT: number;
  @IsNotEmpty()
  @IsString()
  PG_USER: string;
  @IsNotEmpty()
  @IsString()
  PG_PASSWORD: string;
  @IsNotEmpty()
  @IsString()
  PG_DB: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) throw new Error(errors.toString());

  return validatedConfig;
}
