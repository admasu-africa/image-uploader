import { Injectable } from '@nestjs/common';
import {
  IsNotEmpty,
  Validate,
  ValidationArguments,
} from 'class-validator';

// Custom Validator for File Validation
@Injectable()
export class FileValidator {
  validate(files: Express.Multer.File[], args: ValidationArguments): boolean {
    if (!Array.isArray(files) || files.length === 0) {
      return false; // At least one file is required
    }

    for (const file of files) {
      if (!file.mimetype.startsWith('image/')) {
        return false; // Only images are allowed
      }

      const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB
      if (file.size > maxSizeInBytes) {
        return false; // File size exceeds the limit
      }
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Files must be images under 2MB, and at least one file is required.';
  }
}

// DTO for Creating an Item
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
