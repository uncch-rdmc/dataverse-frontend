import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import styles from './AccessFileMenu.module.scss'
import { RequestAccessModal } from './RequestAccessModal'
import {
  FilePreview,
  FilePublishingStatus
} from '../../../../../../../../files/domain/models/FilePreview'
import { useTranslation } from 'react-i18next'

interface RequestAccessButtonProps {
  file: FilePreview
}
export function RequestAccessOption({ file }: RequestAccessButtonProps) {
  const { t } = useTranslation('files')
  console.log(file.permissions.canDownloadFile)
  if (
    file.version.publishingStatus === FilePublishingStatus.DEACCESSIONED ||
    file.permissions.canDownloadFile
  ) {
    return <></>
  }
  if (file.isActivelyEmbargoed) {
    if (file.access.restricted) {
      return (
        <DropdownButtonItem disabled>
          {t('requestAccess.embargoedThenRestricted')}.
        </DropdownButtonItem>
      )
    }
    return <DropdownButtonItem disabled>{t('requestAccess.embargoed')}.</DropdownButtonItem>
  }
  if (!file.access.canBeRequested) {
    return <DropdownButtonItem disabled>{t('requestAccess.requestNotAllowed')}.</DropdownButtonItem>
  }
  if (file.access.requested) {
    return (
      <DropdownButtonItem disabled className={styles['access-requested-message']}>
        {t('requestAccess.accessRequested')}
      </DropdownButtonItem>
    )
  }
  return <RequestAccessModal fileId={file.id} />
}
