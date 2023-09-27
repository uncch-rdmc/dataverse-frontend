import { useEffect, useState } from 'react'
import { FilePaginationInfo } from '../../../../../files/domain/models/FilePaginationInfo'
import { File } from '../../../../../files/domain/models/File'
import { Row } from '@tanstack/react-table'
import { RowSelection } from '../useFilesTable'

export type FileSelection = {
  [key: string]: number | undefined
}

export function useFileSelection(
  currentPageSelectedRowModel: Record<string, Row<File>>,
  setCurrentPageRowSelection: (rowSelection: RowSelection) => void,
  paginationInfo: FilePaginationInfo
) {
  const [fileSelection, setFileSelection] = useState<FileSelection>({})
  const updateFileSelection = () => {
    const currentPageFileSelection = getCurrentPageFileSelection()
    const currentPageIndexes = getCurrentPageIndexes()

    Object.keys(fileSelection).forEach((key) => {
      const rowIndex = parseInt(key)
      if (currentPageIndexes.includes(rowIndex)) {
        if (!currentPageFileSelection[key]) {
          delete fileSelection[key]
        }
      }
    })

    return { ...fileSelection, ...currentPageFileSelection }
  }
  const getCurrentPageIndexes = () => {
    return Array.from(
      { length: paginationInfo.pageSize },
      (_, i) => i + (paginationInfo.page - 1) * paginationInfo.pageSize
    )
  }
  const getCurrentPageFileSelection = () => {
    const rowSelectionFixed: FileSelection = {}
    const currentPageIndexes = getCurrentPageIndexes()

    Object.entries(currentPageSelectedRowModel).forEach(([string, Row]) => {
      const rowIndex = parseInt(string)
      rowSelectionFixed[currentPageIndexes[rowIndex]] = Row.original.id
    })
    return rowSelectionFixed
  }
  const computeCurrentPageRowSelection = () => {
    const rowSelectionOfCurrentPage: RowSelection = {}
    const currentPageIndexes = getCurrentPageIndexes()

    Object.keys(fileSelection).forEach((key) => {
      const rowIndex = parseInt(key)
      if (currentPageIndexes.includes(rowIndex)) {
        rowSelectionOfCurrentPage[currentPageIndexes.indexOf(rowIndex)] = true
      }
    })

    return rowSelectionOfCurrentPage
  }
  const selectAllFiles = () => {
    setCurrentPageRowSelection(createRowSelection(paginationInfo.pageSize))
    setFileSelection(createFileSelection(paginationInfo.totalFiles))
  }
  const clearFileSelection = () => {
    setCurrentPageRowSelection({})
    setFileSelection({})
  }

  useEffect(() => {
    setFileSelection(updateFileSelection())
  }, [currentPageSelectedRowModel])

  useEffect(() => {
    setCurrentPageRowSelection(computeCurrentPageRowSelection())
  }, [paginationInfo])

  return {
    fileSelection,
    selectAllFiles,
    clearFileSelection
  }
}

export function createRowSelection(numberOfRows: number) {
  const rowSelection: Record<string, boolean> = {}

  for (let i = 0; i < numberOfRows; i++) {
    rowSelection[String(i)] = true
  }

  return rowSelection
}

export function createFileSelection(numberOfRows: number) {
  const fileSelection: FileSelection = {}

  for (let i = 0; i < numberOfRows; i++) {
    fileSelection[String(i)] = undefined
  }

  return fileSelection
}
