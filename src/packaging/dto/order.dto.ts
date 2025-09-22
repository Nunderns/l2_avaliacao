import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductDto } from './product.dto';

export class OrderDto {
  @ApiProperty({ example: 'order-1' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ type: [ProductDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];
}
