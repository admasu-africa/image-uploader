import { Injectable } from '@nestjs/common';
import {
  IsNotEmpty,
  Validate,
  ValidationArguments,
} from 'class-validator';


@Injectable()
export class FileValidator {
  validate(files: Express.Multer.File[], args: ValidationArguments): boolean {
    if (!Array.isArray(files) || files.length === 0) {
      return false; 
    }

    for (const file of files) {
      if (!file.mimetype.startsWith('image/')) {
        return false; 
      }

      const maxSizeInBytes = 2 * 1024 * 1024; 
      if (file.size > maxSizeInBytes) {
        return false; 
      }
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Files must be images under 2MB, and at least one file is required.';
  }
}


export class CreateItemDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @Validate(FileValidator, {
    message: 'Files must be valid images under 2MB, and at least one file is required.',
  })
  files: Express.Multer.File[];
}
