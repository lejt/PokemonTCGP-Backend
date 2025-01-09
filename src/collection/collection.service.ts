import { Injectable } from '@nestjs/common';
import { Collection } from './collection.model';
import { Card } from 'src/cards/card.entity';

@Injectable()
export class CollectionService {
  constructor(private collection: Collection = []) {}

  getCollection(): Collection {
    // db pull of all user's collection
    // return user.collection
  }

  addToCollection({ id }: Card): Collection {
    // addToCollection({ id, name, description }: Card): Collection {
    // check if existing in collection through name or card id
    // should be user.collection.find

    // If your collection is stored in a database, consider using a query to check
    // for existing cards before updating or inserting. For example:
    // - SQL: Use ON CONFLICT for PostgreSQL or similar features in other databases.

    const existingCard = this.collection.find((card) => card.id === id);

    if (existingCard) {
      existingCard.quantity = existingCard.quantity + 1;
      return this.collection;
    }

    // const newCard: Card = {
    //   id: id,
    //   name: name,
    //   description: description,
    // };

    // this.collection.push(newCard);
    return this.collection;
  }
}
