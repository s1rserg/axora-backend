import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { TransformPlainToInstance } from 'class-transformer';

import { Public } from '@modules/auth/decorators/public.decorator';

import { FileUpload } from '@common/types';
import { ProductResponseDto } from '@common/dto/product/product-response.dto';
import { SwaggerNotFoundResponse } from '@swagger-decorators/not-found-response.decorator';

import { CreateProductDto } from './dto/create-product.dto';
import { GetAllProductsQueryDto } from './dto/get-all-products-query.dto';
import { ProductService } from './services/product.service';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Product data and images',
    type: CreateProductDto,
  })
  @TransformPlainToInstance(ProductResponseDto)
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /image\/(jpeg|png|webp)/ }),
        ],
      }),
    )
    files: Express.Multer.File[],
  ): Promise<ProductResponseDto> {
    const fileUploads: FileUpload[] = files
      ? files.map((f) => ({
          buffer: f.buffer,
          originalname: f.originalname,
          mimetype: f.mimetype,
        }))
      : [];

    return this.productService.create(createProductDto, fileUploads);
  }

  @Get()
  @Public()
  @TransformPlainToInstance(ProductResponseDto)
  async findAll(@Query() query: GetAllProductsQueryDto): Promise<ProductResponseDto[]> {
    const products = await this.productService.findAll(query);

    return products;
  }

  @Get(':id')
  @Public()
  @SwaggerNotFoundResponse()
  @TransformPlainToInstance(ProductResponseDto)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ProductResponseDto> {
    return this.productService.findOne(id);
  }
}
