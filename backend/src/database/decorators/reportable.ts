/* eslint-disable */
import { ColumnOptions, getMetadataArgsStorage } from 'typeorm';
import { MetadataArgsStorage } from 'typeorm/metadata-args/MetadataArgsStorage';

export interface ReportableFields {
  target: Function;
  propertyName: string;
  options: ReportableOptions;
}

export interface ReportableArgsStorage extends MetadataArgsStorage {
  reportable: ReportableFields[];
}

export interface ReportableOptions extends ColumnOptions {
  name: string;
}

// This decorators can let you set up the report header's name in the entity instead of the service layer

export function Reportable(options: ReportableOptions) {
  return (object: unknown, propertyName: string) => {
    const metadata = <ReportableArgsStorage>getMetadataArgsStorage();
    if (!metadata.reportable) metadata.reportable = [];
    metadata.reportable.push({
      target: object.constructor,
      propertyName,
      options,
    });
  };
}
