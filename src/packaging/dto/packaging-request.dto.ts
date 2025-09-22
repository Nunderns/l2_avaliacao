import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderDto } from './order.dto';

export class PackagingRequestDto {
  @ApiProperty({ type: [OrderDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderDto)
  orders: OrderDto[];
}
