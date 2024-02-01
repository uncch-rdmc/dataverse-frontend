import { File } from '../../../../../src/files/domain/models/File'
import { faker } from '@faker-js/faker'
import { DatasetVersionMother } from '../../../dataset/domain/models/DatasetMother'
import {
  FileChecksumMother,
  FileEmbargoMother,
  FileLabelMother,
  FileSizeMother,
  FileTabularDataMother,
  FileTypeMother,
  FileVersionMother
} from './FilePreviewMother'

export class FileMother {
  static create(props?: Partial<File>): File {
    const name = props?.name ?? faker.system.fileName()
    return {
      name: faker.system.fileName(),
      version: FileVersionMother.create(),
      datasetVersion: DatasetVersionMother.create(),
      type: FileTypeMother.create(),
      size: FileSizeMother.create(),
      citation: FileCitationMother.create(name),
      restricted: faker.datatype.boolean(),
      permissions: {
        canDownloadFile: faker.datatype.boolean()
      },
      labels: faker.datatype.boolean() ? FileLabelMother.createMany(3) : [],
      depositDate: faker.date.past(),
      publicationDate: faker.datatype.boolean() ? faker.date.past() : undefined,
      thumbnail: faker.datatype.boolean() ? faker.image.imageUrl(400) : undefined,
      directory: faker.datatype.boolean() ? faker.system.directoryPath() : undefined,
      persistentId: faker.datatype.boolean() ? faker.datatype.uuid() : undefined,
      downloadUrls: {
        original: '/api/access/datafile/107',
        tabular: '/api/access/datafile/107',
        rData: '/api/access/datafile/107'
      },
      tabularData: faker.datatype.boolean() ? FileTabularDataMother.create() : undefined,
      description: faker.datatype.boolean() ? faker.lorem.sentence() : undefined,
      checksum: faker.datatype.boolean() ? FileChecksumMother.create() : undefined,
      embargo: faker.datatype.boolean() ? FileEmbargoMother.create() : undefined,
      ...props
    }
  }

  static createRealistic(props?: Partial<File>): File {
    return this.create({
      name: 'File Title',
      datasetVersion: DatasetVersionMother.createRealistic(),
      citation: FileCitationMother.create('File Title'),
      restricted: false,
      permissions: {
        canDownloadFile: true
      },
      persistentId: 'doi:10.5072/FK2/ABC123',
      checksum: FileChecksumMother.createRealistic(),
      ...props
    })
  }

  static createRestricted(props?: Partial<File>): File {
    return this.createRealistic(
      this.createWithDownloadPermissionDenied({ restricted: true, ...props })
    )
  }

  static createRestrictedWithAccessGranted(props?: Partial<File>): File {
    return this.createRestricted(this.createWithDownloadPermissionGranted(props))
  }

  static createWithThumbnail(props?: Partial<File>): File {
    return this.create({
      thumbnail: faker.image.imageUrl(),
      ...props
    })
  }

  static createWithoutThumbnail(props?: Partial<File>): File {
    return this.create({
      thumbnail: undefined,
      ...props
    })
  }

  static createWithDownloadPermissionGranted(props?: Partial<File>): File {
    return this.create({
      permissions: {
        canDownloadFile: true
      },
      ...props
    })
  }

  static createWithDownloadPermissionDenied(props?: Partial<File>): File {
    return this.create({
      permissions: {
        canDownloadFile: false
      },
      ...props
    })
  }
}

export class FileCitationMother {
  static create(fileName: string): string {
    return `Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Dataset Title", <a href="https://doi.org/10.5072/FK2/BUDNRV" target="_blank">https://doi.org/10.5072/FK2/BUDNRV</a>, Root, V1; ${fileName} [fileName]`
  }

  static createDraft(fileName: string): string {
    return `Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Dataset Title", <a href="https://doi.org/10.5072/FK2/BUDNRV" target="_blank">https://doi.org/10.5072/FK2/BUDNRV</a>, Root, DRAFT; ${fileName} [fileName]`
  }

  static createDeaccessioned(fileName: string): string {
    return `Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Dataset Title", <a href="https://doi.org/10.5072/FK2/BUDNRV" target="_blank">https://doi.org/10.5072/FK2/BUDNRV</a>, Root, DEACCESSIONED; ${fileName} [fileName]`
  }
}
