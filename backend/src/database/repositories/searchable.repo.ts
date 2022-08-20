import {
  Raw,
  Repository,
  SelectQueryBuilder,
  getMetadataArgsStorage,
} from 'typeorm';
import { SearchableArgsStorage } from '@/database/decorators/searchable';
import { SortOrdering } from '@/shared/enums/_index';

export class SearchableRepository<T> extends Repository<T> {
  private searchableKeys: string[];

  constructor() {
    super();

    const metadata = <SearchableArgsStorage>getMetadataArgsStorage();
    const currentEntity = metadata.entityRepositories.find(
      (item) => item.target === Object.getPrototypeOf(this).constructor
    ).entity;

    this.searchableKeys = metadata.searchable
      .filter((field) => field.target === currentEntity)
      .map((field) => field.propertyName);
  }

  async search(
    keyword: string,
    pageIndex = 0,
    itemsPerPage = 10,
    sortBy: string,
    orderBy: SortOrdering.ASC | SortOrdering.DESC = SortOrdering.DESC
  ): Promise<SelectQueryBuilder<T>> {
    const builder = this.createQueryBuilder();
    if (keyword) {
      this.searchableKeys.forEach((key) => {
        builder.orWhere({
          [key]: Raw((alias) => `LOWER(${alias}) Like LOWER(:value)`, {
            value: `%${keyword}%`,
          }),
        });
      });
    }

    if (sortBy) builder.orderBy(sortBy, orderBy);

    return builder.skip(itemsPerPage * pageIndex).take(itemsPerPage);
  }
}
