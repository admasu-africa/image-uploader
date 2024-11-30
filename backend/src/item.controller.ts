import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
  ValidationPipe,
  BadRequestException,
  Get,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateItemDto } from './create-item.dto';
import { ItemService } from './item.service';
import { Item } from './item.entity';

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  async getItems(): Promise<Item[]> {
    return await this.itemService.getAllItems();
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async createItem(
    @UploadedFiles() files: Express.Multer.File[],
    @Body(new ValidationPipe({ whitelist: true })) createItemDto: CreateItemDto,
  ) {

    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image must be uploaded.');
    }

    const maxSizeInMB = 2; 
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif']; 


    for (const file of files) {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          `Invalid file type: ${file.originalname}. Only JPEG, PNG, and GIF are allowed.`
        );
      }


      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > maxSizeInMB) {
        throw new BadRequestException(
          `File ${file.originalname} exceeds the maximum size of ${maxSizeInMB} MB.`
        );
      }
    }
    createItemDto.files = files;


    return this.itemService.createItem(
      createItemDto.title,
      createItemDto.description,
      createItemDto.files,
    );
  }

}




// import { Controller, Post, Body, UploadedFiles, UseInterceptors } from '@nestjs/common';
// import { FilesInterceptor } from '@nestjs/platform-express';
// import { ItemService } from './item.service';

// @Controller('items')
// export class ItemController {
//   constructor(private readonly itemService: ItemService) {}

//   @Post()
//   @UseInterceptors(FilesInterceptor('files', 10)) // Allow up to 10 files
//   async createItem(
//     @Body('title') title: string,
//     @Body('description') description: string,
//     @UploadedFiles() files: Express.Multer.File[],
//   ) {
//     return this.itemService.createItem(title, description, files);
//   }
// }

