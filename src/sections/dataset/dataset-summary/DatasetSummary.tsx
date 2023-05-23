import { DatasetField } from '../../../dataset/domain/models/Dataset'
import { SummaryFields } from './SummaryFields'
import { License as LicenseModel } from '../../../dataset/domain/models/Dataset'
import { License } from './License'
interface DatasetSummaryProps {
  summaryFields: DatasetField[]
  license: LicenseModel
}

export function DatasetSummary({ summaryFields, license }: DatasetSummaryProps) {
  return (
    <article>
      <SummaryFields summaryFields={summaryFields}></SummaryFields>
      <License license={license}></License>
    </article>
  )
}
