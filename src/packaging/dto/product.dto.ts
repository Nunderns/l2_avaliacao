import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class ProductDto {
  @ApiProperty({ example: 'prod-1' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 'Controle Xbox', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 10, description: 'Altura em cm' })
  @IsInt()
  @IsPositive()
  height: number;

  @ApiProperty({ example: 20, description: 'Largura em cm' })
  @IsInt()
  @IsPositive()
  width: number;

  @ApiProperty({ example: 30, description: 'Comprimento em cm' })
  @IsInt()
  @IsPositive()
  length: number;
}
