import { FilePreviewMother } from '../../../../../../../files/domain/models/FilePreviewMother'
import { FileTitle } from '../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/FileTitle'
import { FilePublishingStatus } from '../../../../../../../../../src/files/domain/models/FilePreview'

describe('FileTitle', () => {
  it('renders the link and name correctly', () => {
    const id = 12345
    const versionParameter = '&version=1'
    const name = 'file-name.txt'
    const file = FilePreviewMother.create({
      id: id,
      version: { number: 1, publishingStatus: FilePublishingStatus.RELEASED },
      name: name
    })

    cy.customMount(<FileTitle link={file.getLink()} name={file.name} />)

    cy.findByRole('link', { name: name }).should(
      'have.attr',
      'href',
      `/file?id=${id}${versionParameter}`
    )
  })
})
