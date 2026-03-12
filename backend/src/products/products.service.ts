import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { PaginatedResult } from '../common/pagination.dto';
import { ImageKitService } from './imagekit.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly imageKitService: ImageKitService,
  ) {}

  async create(dto: CreateProductDto, imageFile?: Express.Multer.File): Promise<Product> {
    const product = this.productRepo.create(dto);
    if (imageFile?.buffer && this.imageKitService.isConfigured()) {
      const { url, fileId } = await this.imageKitService.upload(
        imageFile.buffer,
        imageFile.originalname,
        'products',
      );
      product.imageUrl = url;
      product.imageKitId = fileId;
    }
    return this.productRepo.save(product);
  }

  async findAll(filters: FilterProductDto): Promise<PaginatedResult<Product>> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC' } = filters;
    const skip = (page - 1) * limit;

    const qb = this.productRepo.createQueryBuilder('product');

    if (search?.trim()) {
      qb.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search)',
        { search: `%${search.trim()}%` },
      );
    }

    qb.orderBy(`product.${sortBy}`, sortOrder)
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

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(
    id: string,
    dto: UpdateProductDto,
    imageFile?: Express.Multer.File,
  ): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    if (imageFile?.buffer && this.imageKitService.isConfigured()) {
      if (product.imageKitId) await this.imageKitService.delete(product.imageKitId);
      const { url, fileId } = await this.imageKitService.upload(
        imageFile.buffer,
        imageFile.originalname,
        'products',
      );
      product.imageUrl = url;
      product.imageKitId = fileId;
    }
    return this.productRepo.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    if (product.imageKitId && this.imageKitService.isConfigured()) {
      await this.imageKitService.delete(product.imageKitId);
    }
    await this.productRepo.remove(product);
  }
}
