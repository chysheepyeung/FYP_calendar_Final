/* eslint-disable */
import { ColumnOptions, getMetadataArgsStorage } from 'typeorm';
import { MetadataArgsStorage } from 'typeorm/metadata-args/MetadataArgsStorage';

export interface SearchableArgsStorage extends MetadataArgsStorage {
  searchable: { target: Function; propertyName: string }[];
}

export function Searchable(_options?: ColumnOptions) {
  return (object: unknown, propertyName: string) => {
    const metadata = <SearchableArgsStorage>getMetadataArgsStorage();
    if (!metadata.searchable) metadata.searchable = [];
    metadata.searchable.push({
      target: object.constructor,
      propertyName,
    });
  };
}
