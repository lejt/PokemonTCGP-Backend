import { Controller, Get } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { Collection } from './collection.model';

@Controller('collection')
export class CollectionsController {
  constructor(private readonly CollectionService: CollectionsService) {}

  @Get()
  getCollection(): Collection[] {
    return this.CollectionService.getCollection();
  }
}
