"use client"

import { useCallback } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import type { GridState, Column } from "../types/grid"

export function useGridState(initialColumns: Column[]) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const createQueryString = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams)
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })
      return params.toString()
    },
    [searchParams],
  )

  const state: GridState = {
    columns: initialColumns,
    hiddenColumns: searchParams.get("hiddenColumns")?.split(",") || [],
    sortBy: searchParams.get("sortBy") ? JSON.parse(searchParams.get("sortBy")!) : null,
    currentPage: Number(searchParams.get("page")) || 1,
    rowsPerPage: Number(searchParams.get("pageSize")) || 20,
    searchQuery: searchParams.get("search") || "",
  }

  const updateState = useCallback(
    (updates: Partial<GridState>) => {
      const queryUpdates: Record<string, string> = {}

      if ("hiddenColumns" in updates && updates.hiddenColumns?.length) {
        queryUpdates.hiddenColumns = updates.hiddenColumns.join(",")
      }

      if ("sortBy" in updates && updates.sortBy) {
        queryUpdates.sortBy = JSON.stringify(updates.sortBy)
      }

      if ("currentPage" in updates) {
        queryUpdates.page = String(updates.currentPage)
      }

      if ("rowsPerPage" in updates) {
        queryUpdates.pageSize = String(updates.rowsPerPage)
      }

      if ("searchQuery" in updates) {
        queryUpdates.search = updates.searchQuery || ""
      }

      router.push(`${pathname}?${createQueryString(queryUpdates)}`)
    },
    [pathname, router, createQueryString],
  )

  return { state, updateState }
}

