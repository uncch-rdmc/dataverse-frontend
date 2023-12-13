import { ColumnDef } from '@tanstack/react-table'
import { FilePreview } from '../../../../files/domain/models/FilePreview'
import { RowSelectionCheckbox } from './row-selection/RowSelectionCheckbox'
import { FileInfoCell } from './file-info/file-info-cell/FileInfoCell'
import { FileInfoHeader } from './file-info/FileInfoHeader'
import { FileActionsHeader } from './file-actions/FileActionsHeader'
import { FileActionsCell } from './file-actions/file-actions-cell/FileActionsCell'
import { FilePaginationInfo } from '../../../../files/domain/models/FilePaginationInfo'
import { FileSelection } from './row-selection/useFileSelection'

export const createColumnsDefinition = (
  paginationInfo: FilePaginationInfo,
  fileSelection: FileSelection
): ColumnDef<FilePreview>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <RowSelectionCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
          disabled: table.getPageCount() === 0
        }}
      />
    ),
    cell: ({ row }) => (
      <RowSelectionCheckbox
        {...{
          checked: row.getIsSelected(),
          disabled: !row.getCanSelect(),
          indeterminate: row.getIsSomeSelected(),
          onChange: row.getToggleSelectedHandler()
        }}
      />
    )
  },
  {
    header: () => <FileInfoHeader paginationInfo={paginationInfo} />,
    accessorKey: 'info',
    cell: (props) => <FileInfoCell file={props.row.original} />
  },
  {
    header: ({ table }) => (
      <FileActionsHeader
        files={table.getRowModel().rows.map((row) => row.original)}
        fileSelection={fileSelection}
      />
    ),
    accessorKey: 'status',
    cell: (props) => <FileActionsCell file={props.row.original} />
  }
]
