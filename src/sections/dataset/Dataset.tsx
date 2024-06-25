import { Col, Row, Tabs } from '@iqss/dataverse-design-system'
import styles from './Dataset.module.scss'
import { DatasetLabels } from './dataset-labels/DatasetLabels'
import { useLoading } from '../loading/LoadingContext'
import { DatasetSkeleton } from './DatasetSkeleton'
import { PageNotFound } from '../page-not-found/PageNotFound'
import { useTranslation } from 'react-i18next'
import { DatasetMetadata } from './dataset-metadata/DatasetMetadata'
import { DatasetSummary } from './dataset-summary/DatasetSummary'
import { DatasetCitation } from './dataset-citation/DatasetCitation'
import { DatasetFiles } from './dataset-files/DatasetFiles'
import { FileRepository } from '../../files/domain/repositories/FileRepository'
import { DatasetActionButtons } from './dataset-action-buttons/DatasetActionButtons'
import { useDataset } from './DatasetContext'
import { useEffect, useRef } from 'react'
import { useNotImplementedModal } from '../not-implemented/NotImplementedModalContext'
import { NotImplementedModal } from '../not-implemented/NotImplementedModal'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { useAlertContext } from '../alerts/AlertContext'
import { AlertMessageKey } from '../../alert/domain/models/Alert'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { useLocation } from 'react-router-dom'
import { Alerts } from '../alerts/Alerts'
import usePollDatasetLocks from './usePollDatasetLocks'

interface DatasetProps {
  fileRepository: FileRepository
  datasetRepository: DatasetRepository
  created?: boolean
  publishInProgress?: boolean
}

export function Dataset({
  fileRepository,
  datasetRepository,
  created,
  publishInProgress
}: DatasetProps) {
  const { setIsLoading } = useLoading()
  const { dataset, isLoading } = useDataset()
  const { t } = useTranslation('dataset')
  const { hideModal, isModalOpen } = useNotImplementedModal()
  const { addDatasetAlert, removeDatasetAlert, setDatasetAlerts, datasetAlerts } = useAlertContext()

  if (created) {
    addDatasetAlert({ messageKey: AlertMessageKey.DATASET_CREATED, variant: 'success' })
  }

  useEffect(() => {
    setIsLoading(isLoading)
  }, [isLoading, setIsLoading])

  useEffect(() => {
    if (setDatasetAlerts) {
      if (publishInProgress) {
        console.log('state.publishInProgress', publishInProgress)
        setDatasetAlerts([{ messageKey: AlertMessageKey.PUBLISH_IN_PROGRESS, variant: 'info' }])
      } else {
        console.log('else condition  setting alerts')
        if (dataset && setDatasetAlerts) {
          setDatasetAlerts(dataset.alerts)
        }
      }
    }
  }, [dataset, setDatasetAlerts])

  usePollDatasetLocks(publishInProgress, dataset, datasetRepository)

  if (isLoading) {
    return <DatasetSkeleton />
  }

  return (
    <>
      <NotImplementedModal show={isModalOpen} handleClose={hideModal} />
      {!dataset ? (
        <PageNotFound />
      ) : (
        <>
          <BreadcrumbsGenerator hierarchy={dataset.hierarchy} />
          <article>
            <div className={styles.container}>
              <Row>
                <Col>
                  <Alerts></Alerts>
                </Col>
              </Row>
            </div>

            <header className={styles.header}>
              <h1>{dataset.version.title}</h1>
              <DatasetLabels labels={dataset.version.labels} />
            </header>
            <div className={styles.container}>
              <Row>
                <Col sm={9}>
                  <DatasetCitation thumbnail={dataset.thumbnail} version={dataset.version} />
                </Col>
                <Col sm={3}>
                  <DatasetActionButtons datasetRepository={datasetRepository} dataset={dataset} />
                </Col>
              </Row>
              <Row>
                <Col sm={9} className={styles['summary-container']}>
                  <DatasetSummary summaryFields={dataset.summaryFields} license={dataset.license} />
                </Col>
              </Row>
              <Tabs defaultActiveKey="files">
                <Tabs.Tab eventKey="files" title={t('filesTabTitle')}>
                  <div className={styles['tab-container']}>
                    <DatasetFiles
                      filesRepository={fileRepository}
                      datasetPersistentId={dataset.persistentId}
                      datasetVersion={dataset.version}
                    />
                  </div>
                </Tabs.Tab>
                <Tabs.Tab eventKey="metadata" title={t('metadataTabTitle')}>
                  <div className={styles['tab-container']}>
                    <DatasetMetadata
                      persistentId={dataset.persistentId}
                      metadataBlocks={dataset.metadataBlocks}
                    />
                  </div>
                </Tabs.Tab>
              </Tabs>
              <SeparationLine />
            </div>
          </article>
        </>
      )}
    </>
  )
}
