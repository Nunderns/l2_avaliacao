import { Test, TestingModule } from '@nestjs/testing';
import { PackagingService } from './packaging.service';

describe('PackagingService', () => {
  let service: PackagingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PackagingService],
    }).compile();

    service = module.get<PackagingService>(PackagingService);
  });

  it('should pack a simple order into one box', () => {
    const response = service.packOrders([
      {
        id: 'order-1',
        products: [
          { id: 'p1', height: 10, width: 10, length: 10 },
          { id: 'p2', height: 10, width: 10, length: 10 },
        ],
      },
    ]);

    expect(response.results).toHaveLength(1);
    const result = response.results[0];
    expect(result.orderId).toBe('order-1');
    expect(result.boxes.length).toBeGreaterThanOrEqual(1);
    const totalProducts = result.boxes.reduce((sum, b) => sum + b.products.length, 0);
    expect(totalProducts).toBe(2);
  });

  it('should choose the smallest possible box for a large product', () => {
    const response = service.packOrders([
      {
        id: 'order-2',
        products: [{ id: 'big', height: 30, width: 40, length: 80 }],
      },
    ]);

    const result = response.results[0];
    expect(result.boxes).toHaveLength(1);
    expect(result.boxes[0].boxType).toBe('BOX_1');
  });
});
