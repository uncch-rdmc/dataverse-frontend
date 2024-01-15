import { Accordion, Col, Row } from '@iqss/dataverse-design-system'
import { File } from '../../../files/domain/models/File'
import { FilePreview } from '../file-preview/FilePreview'
import { FileLabels } from '../../dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/FileLabels'
import styles from './FileMetadata.module.scss'

interface FileMetadataProps {
  file: File
}

const BASE_URL = (import.meta.env.VITE_DATAVERSE_BACKEND_URL as string) ?? ''

export function FileMetadata({ file }: FileMetadataProps) {
  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>File Metadata</Accordion.Header>
        <Accordion.Body>
          <Row className={styles.row}>
            <Col sm={3}>
              <strong>Preview</strong>
            </Col>
            <Col>
              <FilePreview thumbnail={file.thumbnail} type={file.type} name={file.name} />
            </Col>
          </Row>
          {file.labels.length > 0 && (
            <Row className={styles.row}>
              <Col sm={3}>
                <strong>File Tags</strong>
              </Col>
              <Col>
                <FileLabels labels={file.labels} />
              </Col>
            </Row>
          )}
          {file.persistentId && (
            <Row className={styles.row}>
              <Col sm={3}>
                <strong>File Persistent ID</strong>
              </Col>
              <Col>{file.persistentId}</Col>
            </Row>
          )}
          {file.permissions.canDownloadFile && (
            <Row className={styles.row}>
              <Col sm={3}>
                <strong>Download URL</strong>
              </Col>
              <Col>
                <p className={styles['help-text']}>
                  Use the Download URL in a Wget command or a download manager to avoid interrupted
                  downloads, time outs or other failures.{' '}
                  <a href="https://guides.dataverse.org/en/6.1/user/find-use-data.html#downloading-via-url">
                    User Guide - Downloading via URL
                  </a>
                </p>
                <code className={styles.code}>
                  {BASE_URL}
                  {file.downloadUrls.original}
                </code>
              </Col>
            </Row>
          )}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}
