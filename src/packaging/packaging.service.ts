import { Injectable, BadRequestException } from '@nestjs/common';
import { ProductDto } from './dto/product.dto';
import { OrderDto } from './dto/order.dto';
import { PackagingResponseDto, OrderPackagingResultDto, BoxUsageDto, PackedProductDto } from './dto/packaging-response.dto';

export type BoxType = 'BOX_1' | 'BOX_2' | 'BOX_3';

interface BoxDef {
  type: BoxType;
  dims: [number, number, number]; // [h, w, l] cm
  volume: number; // cm^3
}

@Injectable()
export class PackagingService {
  private readonly boxes: BoxDef[] = [
    { type: 'BOX_1', dims: [30, 40, 80], volume: 30 * 40 * 80 },
    { type: 'BOX_2', dims: [50, 50, 40], volume: 50 * 50 * 40 },
    { type: 'BOX_3', dims: [50, 80, 60], volume: 50 * 80 * 60 },
  ];

  packOrders(orders: OrderDto[]): PackagingResponseDto {
    if (!orders?.length) {
      throw new BadRequestException('Lista de pedidos vazia.');
    }

    const results: OrderPackagingResultDto[] = orders.map((order) => ({
      orderId: order.id,
      boxes: this.packSingleOrder(order),
    }));

    return { results };
  }

  private packSingleOrder(order: OrderDto): BoxUsageDto[] {
    const products = [...order.products];
    // Ordena por volume decrescente (First-Fit Decreasing)
    products.sort((a, b) => this.volumeOf(b) - this.volumeOf(a));

    const packed: BoxUsageDto[] = [];

    for (const p of products) {
      // tenta colocar em alguma caixa já aberta
      let placed = false;
      for (const box of packed) {
        if (this.canPlaceInBox(p, box)) {
          this.placeInBox(p, box);
          placed = true;
          break;
        }
      }
      if (placed) continue;

      // abre uma nova caixa do menor tipo possível que caiba o produto
      const boxType = this.findSmallestFittingBox(p);
      if (!boxType) {
        throw new BadRequestException(
          `Produto ${p.id} não cabe em nenhuma caixa disponível (dimensões: ${p.height}x${p.width}x${p.length}).`,
        );
      }
      const boxDef = this.boxes.find((b) => b.type === boxType)!;
      const newBox: BoxUsageDto = {
        boxType: boxDef.type,
        boxDimensions: [...boxDef.dims],
        products: [],
      };
      this.placeInBox(p, newBox);
      packed.push(newBox);
    }

    // Heurística para tentar reduzir número de caixas: ordenar caixas por folga de volume
    // (Passo simples, sem reempacotar produtos já posicionados.)
    packed.sort(
      (a, b) => this.freeVolume(b) - this.freeVolume(a),
    );

    return packed;
  }

  private volumeOf(p: ProductDto): number {
    return p.height * p.width * p.length;
  }

  private canPlaceInBox(p: ProductDto, box: BoxUsageDto): boolean {
    const boxDims = [...box.boxDimensions].sort((x, y) => x - y);
    const orientations: [number, number, number][] = this.getOrientations(p);

    // checa se o produto cabe nas dimensões da caixa (com rotação)
    const fitsDimension = orientations.some((o) => {
      const sorted = [...o].sort((x, y) => x - y);
      return (
        sorted[0] <= boxDims[0] &&
        sorted[1] <= boxDims[1] &&
        sorted[2] <= boxDims[2]
      );
    });
    if (!fitsDimension) return false;

    // checa volume remanescente simples (heurística)
    return this.freeVolume(box) >= this.volumeOf(p);
  }

  private placeInBox(p: ProductDto, box: BoxUsageDto): void {
    const packed: PackedProductDto = {
      id: p.id,
      name: p.name,
      dimensions: [p.height, p.width, p.length],
    };
    box.products.push(packed);
  }

  private freeVolume(box: BoxUsageDto): number {
    const boxDef = this.boxes.find((b) => b.type === box.boxType)!;
    const used = box.products.reduce((sum, prod) => sum + prod.dimensions[0] * prod.dimensions[1] * prod.dimensions[2], 0);
    return boxDef.volume - used;
  }

  private getOrientations(p: ProductDto): [number, number, number][] {
    const { height: h, width: w, length: l } = p;
    return [
      [h, w, l],
      [h, l, w],
      [w, h, l],
      [w, l, h],
      [l, h, w],
      [l, w, h],
    ];
  }

  private findSmallestFittingBox(p: ProductDto): BoxType | undefined {
    // tenta da menor para a maior por volume
    const sorted = [...this.boxes].sort((a, b) => a.volume - b.volume);
    for (const b of sorted) {
      const dims = [...b.dims].sort((x, y) => x - y);
      const fits = this.getOrientations(p).some((o) => {
        const s = [...o].sort((x, y) => x - y);
        return s[0] <= dims[0] && s[1] <= dims[1] && s[2] <= dims[2];
      });
      if (fits) return b.type;
    }
    return undefined;
  }
}
