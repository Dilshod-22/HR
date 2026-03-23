import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { StockReceipt } from './stock-receipt.entity';
import { StockReceiptItem } from './stock-receipt-item.entity';
import { CreateStockReceiptDto } from './dto/create-stock-receipt.dto';
import { Product } from '../products/product.entity';

@Injectable()
export class StockReceiptsService {
  constructor(
    @InjectRepository(StockReceipt)
    private readonly receiptRepo: Repository<StockReceipt>,
    @InjectRepository(StockReceiptItem)
    private readonly itemRepo: Repository<StockReceiptItem>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(dto: CreateStockReceiptDto) {
    return this.receiptRepo.manager.transaction(async (em) => {
      const receipt = await em.save(
        em.create(StockReceipt, {
          counterpartyId: dto.counterpartyId,
          employeeId: dto.employeeId ?? null,
          receiptDate: dto.receiptDate,
          note: dto.note ?? null,
          totalAmount: 0,
        }),
      );

      let totalAmount = 0;
      for (const line of dto.items) {
        const product = await em.findOne(Product, { where: { id: line.productId } });
        if (!product) throw new NotFoundException('Mahsulot topilmadi');

        const salePrice =
          line.salePrice ?? (Number(product.price) || Number(line.purchasePrice));
        if (salePrice < Number(line.purchasePrice)) {
          throw new BadRequestException('Sotuv narxi kirim narxidan kichik bo‘lishi mumkin emas');
        }

        const lineTotal = Number(line.purchasePrice) * Number(line.quantity);
        totalAmount += lineTotal;

        await em.save(
          em.create(StockReceiptItem, {
            receiptId: receipt.id,
            productId: line.productId,
            quantity: line.quantity,
            purchasePrice: line.purchasePrice,
            salePrice,
            lineTotal,
          }),
        );

        product.stockQty = Number(product.stockQty || 0) + Number(line.quantity);
        product.purchasePrice = Number(line.purchasePrice);
        product.price = Number(salePrice);
        await em.save(product);
      }

      receipt.totalAmount = totalAmount;
      await em.save(receipt);
      return em.findOne(StockReceipt, {
        where: { id: receipt.id },
        relations: ['counterparty', 'employee', 'items', 'items.product'],
      });
    });
  }

  async findAll(filters: { page?: number; limit?: number; fromDate?: string; toDate?: string; productId?: string }) {
    const { page = 1, limit = 20, fromDate, toDate, productId } = filters;
    const skip = (page - 1) * limit;

    const qb = this.receiptRepo
      .createQueryBuilder('receipt')
      .leftJoinAndSelect('receipt.counterparty', 'counterparty')
      .leftJoinAndSelect('receipt.employee', 'employee')
      .leftJoinAndSelect('receipt.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .orderBy('receipt.receiptDate', 'DESC')
      .addOrderBy('receipt.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (fromDate && toDate) {
      qb.andWhere('receipt.receiptDate BETWEEN :fromDate AND :toDate', { fromDate, toDate });
    } else if (fromDate) {
      qb.andWhere('receipt.receiptDate >= :fromDate', { fromDate });
    } else if (toDate) {
      qb.andWhere('receipt.receiptDate <= :toDate', { toDate });
    }

    if (productId) qb.andWhere('items.productId = :productId', { productId });

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const receipt = await this.receiptRepo.findOne({
      where: { id },
      relations: ['counterparty', 'employee', 'items', 'items.product'],
    });
    if (!receipt) throw new NotFoundException('Prihod topilmadi');
    return receipt;
  }

  async stockReport(filters: { fromDate?: string; toDate?: string; productId?: string; groupId?: string }) {
    const { fromDate, toDate, productId, groupId } = filters;
    const whereDate =
      fromDate && toDate
        ? { receiptDate: Between(fromDate, toDate) }
        : undefined;

    const productsQb = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.group', 'group')
      .orderBy('group.name', 'ASC')
      .addOrderBy('product.name', 'ASC');

    if (productId) productsQb.andWhere('product.id = :productId', { productId });
    if (groupId) productsQb.andWhere('product.groupId = :groupId', { groupId });
    const products = await productsQb.getMany();

    const receiptsQb = this.itemRepo
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.receipt', 'receipt');
    if (fromDate && toDate) {
      receiptsQb.andWhere('receipt.receiptDate BETWEEN :fromDate AND :toDate', { fromDate, toDate });
    } else if (fromDate) {
      receiptsQb.andWhere('receipt.receiptDate >= :fromDate', { fromDate });
    } else if (toDate) {
      receiptsQb.andWhere('receipt.receiptDate <= :toDate', { toDate });
    }
    if (productId) receiptsQb.andWhere('item.productId = :productId', { productId });
    const movementItems = await receiptsQb.getMany();

    const incomingByProduct = new Map<string, { qty: number; amount: number }>();
    for (const m of movementItems) {
      const prev = incomingByProduct.get(m.productId) || { qty: 0, amount: 0 };
      prev.qty += Number(m.quantity);
      prev.amount += Number(m.lineTotal);
      incomingByProduct.set(m.productId, prev);
    }

    const data = products.map((p) => {
      const inMove = incomingByProduct.get(p.id) || { qty: 0, amount: 0 };
      return {
        productId: p.id,
        productName: p.name,
        groupId: p.groupId ?? null,
        groupName: p.group?.name ?? null,
        stockQty: Number(p.stockQty || 0),
        currentPurchasePrice: Number(p.purchasePrice || 0),
        currentSalePrice: Number(p.price || 0),
        incomingQtyInPeriod: inMove.qty,
        incomingAmountInPeriod: inMove.amount,
      };
    });

    return {
      filters: {
        fromDate: fromDate ?? null,
        toDate: toDate ?? null,
        productId: productId ?? null,
        groupId: groupId ?? null,
      },
      data,
    };
  }
}

