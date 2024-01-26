import { Meta, StoryObj } from '@storybook/react'
import { AccessFileMenu } from '../../../../../../../sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/access-file-menu/AccessFileMenu'
import { WithI18next } from '../../../../../../WithI18next'
import { WithSettings } from '../../../../../../WithSettings'
import { FilePreviewMother } from '../../../../../../../../tests/component/files/domain/models/FilePreviewMother'

const meta: Meta<typeof AccessFileMenu> = {
  title:
    'Sections/Dataset Page/DatasetFiles/FilesTable/FileActionsCell/FileActionButtons/AccessFileMenu',
  component: AccessFileMenu,
  decorators: [WithI18next, WithSettings]
}

export default meta
type Story = StoryObj<typeof AccessFileMenu>

export const Default: Story = {
  render: () => <AccessFileMenu file={FilePreviewMother.createDefault()} />
}

export const NonTabularFiles: Story = {
  render: () => <AccessFileMenu file={FilePreviewMother.createDefault()} />
}

export const TabularFiles: Story = {
  render: () => <AccessFileMenu file={FilePreviewMother.createTabular()} />
}

export const Restricted: Story = {
  render: () => <AccessFileMenu file={FilePreviewMother.createWithRestrictedAccess()} />
}

export const RestrictedWithAccessRequestAllowed: Story = {
  render: () => <AccessFileMenu file={FilePreviewMother.createWithAccessRequestAllowed()} />
}

export const RestrictedWithAccessRequestPending: Story = {
  render: () => <AccessFileMenu file={FilePreviewMother.createWithAccessRequestPending()} />
}

export const RestrictedWithAccessGranted: Story = {
  render: () => (
    <AccessFileMenu file={FilePreviewMother.createWithRestrictedAccessWithAccessGranted()} />
  )
}

export const WithEmbargo: Story = {
  render: () => <AccessFileMenu file={FilePreviewMother.createWithEmbargo()} />
}

export const WithEmbargoAndRestricted: Story = {
  render: () => <AccessFileMenu file={FilePreviewMother.createWithEmbargoRestricted()} />
}
