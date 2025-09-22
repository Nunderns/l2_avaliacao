import { ApiProperty } from '@nestjs/swagger';

export class PackedProductDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ description: 'Dimensões originais do produto [h, w, l] em cm' })
  dimensions: [number, number, number];
}

export class BoxUsageDto {
  @ApiProperty({ description: 'Identificador do tipo de caixa' })
  boxType: 'BOX_1' | 'BOX_2' | 'BOX_3';

  @ApiProperty({ description: 'Dimensões da caixa [h, w, l] em cm' })
  boxDimensions: [number, number, number];

  @ApiProperty({ type: [PackedProductDto] })
  products: PackedProductDto[];
}

export class OrderPackagingResultDto {
  @ApiProperty()
  orderId: string;

  @ApiProperty({ type: [BoxUsageDto] })
  boxes: BoxUsageDto[];
}

export class PackagingResponseDto {
  @ApiProperty({ type: [OrderPackagingResultDto] })
  results: OrderPackagingResultDto[];
}
