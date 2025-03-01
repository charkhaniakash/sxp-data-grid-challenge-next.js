export interface Column {
    id: string
    header: string
    accessorKey: string
    hidden?: boolean
  }
  
  export interface GridState {
    columns: Column[]
    hiddenColumns: string[]
    sortBy: { id: string; desc: boolean } | null
    currentPage: number
    rowsPerPage: number
    searchQuery: string
  }
  
  export interface DataGridProps {
    data: Record<string, any>[]
    columns: Column[]
    defaultRowsPerPage?: number
  }
  
  