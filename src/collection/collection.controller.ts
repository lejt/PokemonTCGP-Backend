import { Controller, Get } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { Collection } from './collection.model';

@Controller('collection')
export class CollectionController {
  constructor(private CollectionService: CollectionService) {}

  @Get()
  getCollection(): Collection[] {
    return this.CollectionService.getCollection();
  }
}
