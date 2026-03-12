import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FilterOrderDto } from './dto/filter-order.dto';
import { PaginatedResult } from '../common/pagination.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepo.create({
      ...dto,
      status: dto.status ?? OrderStatus.PENDING,
    });
    return this.orderRepo.save(order);
  }

  async findAll(filters: FilterOrderDto): Promise<PaginatedResult<Order>> {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      customerId,
      productId,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = filters;
    const skip = (page - 1) * limit;

    const qb = this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.product', 'product');

    if (status) qb.andWhere('order.status = :status', { status });
    if (customerId) qb.andWhere('order.customerId = :customerId', { customerId });
    if (productId) qb.andWhere('order.productId = :productId', { productId });

    if (search?.trim()) {
      qb.andWhere(
        '(customer.firstName ILIKE :search OR customer.lastName ILIKE :search OR customer.fullName ILIKE :search OR customer.email ILIKE :search OR product.name ILIKE :search)',
        { search: `%${search.trim()}%` },
      );
    }

    qb.orderBy(`order.${sortBy}`, sortOrder)
      .skip(skip)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['customer', 'product'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async update(id: string, dto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    Object.assign(order, dto);
    return this.orderRepo.save(order);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepo.remove(order);
  }
}
