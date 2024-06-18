import { MouseEvent, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FieldErrors, FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { SubmissionStatus, useCreateDatasetForm } from './useCreateDatasetForm'
import { type DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { type MetadataBlockInfo } from '../../metadata-block-info/domain/models/MetadataBlockInfo'
import { type CreateDatasetFormValues } from './MetadataFieldsHelper'
import { Form, Accordion, Alert, Button } from '@iqss/dataverse-design-system'
import { RequiredFieldText } from '../shared/form/RequiredFieldText/RequiredFieldText'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'
import { MetadataBlockFormFields } from './MetadataBlockFormFields'
import { Route } from '../Route.enum'
import styles from './DatasetForm.module.scss'
import { useSession } from '../session/SessionContext'

interface DatasetFormProps {
  repository: DatasetRepository
  collectionId?: string
  metadataBlocks: MetadataBlockInfo[]
  errorLoadingMetadataBlocks: string | null
  formDefaultValues: CreateDatasetFormValues
}

export const DatasetForm = ({
  repository,
  collectionId = 'root',
  metadataBlocks,
  errorLoadingMetadataBlocks,
  formDefaultValues
}: DatasetFormProps) => {
  const navigate = useNavigate()
  const { t } = useTranslation('createDataset')

  const accordionRef = useRef<HTMLDivElement>(null)
  const formContainerRef = useRef<HTMLDivElement>(null)

  const { submissionStatus, createError, submitForm } = useCreateDatasetForm(
    repository,
    collectionId,
    onCreateDatasetError
  )
  const { user } = useSession()

  const isErrorLoadingMetadataBlocks = Boolean(errorLoadingMetadataBlocks)

  const form = useForm({
    mode: 'onChange',
    defaultValues: formDefaultValues
  })
  const { setValue } = form
  useEffect(() => {
    if (user) {
      setValue('citation.author.0.authorName', user.displayName)
      setValue('citation.datasetContact.0.datasetContactName', user.displayName)
      setValue('citation.datasetContact.0.datasetContactEmail', user.email, {
        shouldValidate: true
      })
      if (user.affiliation) {
        setValue('citation.datasetContact.0.datasetContactAffiliation', user.affiliation)
        setValue('citation.author.0.authorAffiliation', user.affiliation)
      }
    }
  }, [setValue, user])
  const handleCancel = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    navigate(Route.HOME)
  }

  const onInvalidSubmit = (errors: FieldErrors<CreateDatasetFormValues>) => {
    if (!accordionRef.current) return
    /*
    Get the first metadata block accordion item with an error, and if it's collapsed, open it
    Only for the case when accordion is closed, otherwise focus is already handled by react-hook-form
    */
    const firstMetadataBlockNameWithError = Object.keys(errors)[0]

    const accordionItemsButtons: HTMLButtonElement[] = Array.from(
      accordionRef.current.querySelectorAll('button.accordion-button')
    )

    accordionItemsButtons.forEach((button) => {
      const parentItem = button.closest('.accordion-item')
      const itemBlockName = parentItem?.id.split('-').pop()
      const buttonIsCollapsed = button.classList.contains('collapsed')

      if (itemBlockName === firstMetadataBlockNameWithError && buttonIsCollapsed) {
        button.click()

        setTimeout(
          /* istanbul ignore next */ () => {
            const focusedElement = document.activeElement
            focusedElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          },
          800
        )
      }
    })
  }

  function onCreateDatasetError() {
    if (formContainerRef.current) {
      formContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const disableSubmitButton = useMemo(() => {
    return isErrorLoadingMetadataBlocks || submissionStatus === SubmissionStatus.IsSubmitting
  }, [isErrorLoadingMetadataBlocks, submissionStatus])

  return (
    <div className={styles['form-container']} ref={formContainerRef}>
      <RequiredFieldText />
      {isErrorLoadingMetadataBlocks && (
        <Alert variant="danger" dismissible={false}>
          {errorLoadingMetadataBlocks}
        </Alert>
      )}
      {submissionStatus === SubmissionStatus.IsSubmitting && (
        <p>{t('datasetForm.status.submitting')}</p>
      )}

      {submissionStatus === SubmissionStatus.SubmitComplete && (
        <p>{t('datasetForm.status.success')}</p>
      )}
      {submissionStatus === SubmissionStatus.Errored && (
        <Alert variant={'danger'} customHeading={t('validationAlert.title')} dismissible={false}>
          {createError}
        </Alert>
      )}

      <FormProvider {...form}>
        <Form onSubmit={form.handleSubmit(submitForm, onInvalidSubmit)}>
          {metadataBlocks.length > 0 && (
            <Accordion defaultActiveKey="0" ref={accordionRef}>
              {metadataBlocks.map((metadataBlock, index) => (
                <Accordion.Item
                  eventKey={index.toString()}
                  id={`metadata-block-item-${metadataBlock.name}`}
                  key={metadataBlock.id}>
                  <Accordion.Header>{metadataBlock.displayName}</Accordion.Header>
                  <Accordion.Body>
                    <MetadataBlockFormFields metadataBlock={metadataBlock} />
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          )}

          <SeparationLine />
          <Alert variant={'info'} customHeading={t('metadataTip.title')} dismissible={false}>
            {t('metadataTip.content')}
          </Alert>
          <Button type="submit" disabled={disableSubmitButton}>
            {t('saveButton')}
          </Button>
          <Button
            withSpacing
            variant="secondary"
            type="button"
            onClick={handleCancel}
            disabled={submissionStatus === SubmissionStatus.IsSubmitting}>
            {t('cancelButton')}
          </Button>
        </Form>
      </FormProvider>
    </div>
  )
}
