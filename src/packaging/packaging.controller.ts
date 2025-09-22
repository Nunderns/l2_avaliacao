import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PackagingService } from './packaging.service';
import { PackagingRequestDto } from './dto/packaging-request.dto';
import { PackagingResponseDto } from './dto/packaging-response.dto';

@ApiTags('packaging')
@Controller('packaging')
export class PackagingController {
  constructor(private readonly packagingService: PackagingService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Calcula empacotamento para uma lista de pedidos' })
  @ApiResponse({ status: 200, type: PackagingResponseDto })
  calculate(@Body() body: PackagingRequestDto): PackagingResponseDto {
    return this.packagingService.packOrders(body.orders);
  }
}
