import { Injectable } from '@nestjs/common';
import { Collection } from './collection.model';

@Injectable()
export class CollectionService {
  constructor() {}

  getCollection(): Collection {
    // db pull of all user's collection
    // return user.collection
  }
}
