import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ProductGroupsService } from './product-groups.service';
import { CreateProductGroupDto } from './dto/create-product-group.dto';
import { UpdateProductGroupDto } from './dto/update-product-group.dto';

@Controller('product-groups')
export class ProductGroupsController {
  constructor(private readonly service: ProductGroupsService) {}

  @Post()
  create(@Body() dto: CreateProductGroupDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductGroupDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

