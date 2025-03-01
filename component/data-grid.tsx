"use client"

import * as React from "react"
import { ChevronDown, ChevronUp, Settings } from "lucide-react"
import type { DataGridProps } from "../types/grid"
import { useGridState } from "../hooks/useGridState"
import * as XLSX from "xlsx"
import FileSaver from "file-saver"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../@/components/ui/table"
import { Button } from "../@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../@/components/ui/dropdown-menu"
import { Input } from "../@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../@/components/ui/select"

export function DataGrid({ data, columns, defaultRowsPerPage = 20 }: DataGridProps) {
  const { state, updateState } = useGridState(columns)

  const visibleColumns = columns.filter((column) => !state.hiddenColumns.includes(column.id))

  const sortedData = React.useMemo(() => {
    if (!state.sortBy) return data

    return [...data].sort((a, b) => {
      const { id, desc } = state.sortBy ?? { id: '', desc: false };

      const aValue = a[id]
      const bValue = b[id]

      if (aValue < bValue) return desc ? 1 : -1
      if (aValue > bValue) return desc ? -1 : 1
      return 0
    })
  }, [data, state.sortBy])

  const filteredData = React.useMemo(() => {
    if (!state.searchQuery) return sortedData

    return sortedData.filter((row) =>
      Object.values(row).some((value) => String(value).toLowerCase().includes(state.searchQuery.toLowerCase())),
    )
  }, [sortedData, state.searchQuery])

  const paginatedData = React.useMemo(() => {
    const start = (state.currentPage - 1) * state.rowsPerPage
    const end = start + state.rowsPerPage
    return filteredData.slice(start, end)
  }, [filteredData, state.currentPage, state.rowsPerPage])

  const pageCount = Math.ceil(filteredData.length / state.rowsPerPage)

  const exportData = (format: "csv" | "xlsx") => {
    const exportData = filteredData.map((row) =>
      visibleColumns.reduce(
        (acc, column) => ({
          ...acc,
          [column.header]: row[column.accessorKey],
        }),
        {},
      ),
    )

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")

    const excelBuffer = XLSX.write(workbook, { bookType: format, type: "array" })
    const data = new Blob([excelBuffer], {
      type:
        format === "csv"
          ? "text/csv;charset=utf-8"
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    })
    FileSaver.saveAs(data, `export.${format}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-x-2">
        <Input
          placeholder="Search..."
          value={state.searchQuery}
          onChange={(e: { target: { value: any } }) => updateState({ searchQuery: e.target.value })}
          className="max-w-sm"
        />
        <div className="flex items-center space-x-2">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportData("csv")}>
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => exportData("xlsx")}>
              Export Excel
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {columns.map((column) => (
                <DropdownMenuItem
                  key={column.id}
                  onSelect={() => {
                    const hiddenColumns = state.hiddenColumns.includes(column.id)
                      ? state.hiddenColumns.filter((id) => id !== column.id)
                      : [...state.hiddenColumns, column.id]
                    updateState({ hiddenColumns })
                  }}
                >
                  <input type="checkbox" checked={!state.hiddenColumns.includes(column.id)} className="mr-2" readOnly />
                  {column.header}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.map((column) => (
                <TableHead
                  key={column.id}
                  className="cursor-pointer"
                  onClick={() =>
                    updateState({
                      sortBy: {
                        id: column.id,
                        desc: state.sortBy?.id === column.id ? !state.sortBy.desc : false,
                      },
                    })
                  }
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {state.sortBy?.id === column.id &&
                      (state.sortBy.desc ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row, i) => (
              <TableRow key={i}>
                {visibleColumns.map((column) => (
                  <TableCell key={column.id}>{row[column.accessorKey]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page</span>
          <Select
            value={String(state.rowsPerPage)}
            onValueChange={(value: any) => updateState({ rowsPerPage: Number(value), currentPage: 1 })}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateState({ currentPage: state.currentPage - 1 })}
            disabled={state.currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {state.currentPage} of {pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateState({ currentPage: state.currentPage + 1 })}
            disabled={state.currentPage === pageCount}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

