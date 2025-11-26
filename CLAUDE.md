# Claude Code Standard Pattern for Building Pages

This document defines the standard pattern for building pages in this Next.js project. Follow this pattern for all future page development.

## Standard Page Structure Pattern

When building any new page, follow these steps in order:

### 1. API Integration (`lib/api.ts`)

Create or extend the API service with:
- TypeScript interfaces for data models
- DTOs (Data Transfer Objects) for create/update operations
- CRUD operation functions using axios
- Proper typing for all API responses

**Example Structure:**
```typescript
export interface ResourceName {
  id: number
  field1: string
  field2: string
  // ... other fields
}

export interface CreateResourceDto {
  field1: string
  field2: string
  // ... required fields (exclude id)
}

export interface UpdateResourceDto {
  field1: string
  field2: string
  // ... updatable fields
}

export const resourceApi = {
  getAll: async (): Promise<ResourceName[]> => {
    const { data } = await api.get<ResourceName[]>('/endpoint')
    return data
  },

  getById: async (id: number): Promise<ResourceName> => {
    const { data } = await api.get<ResourceName>(`/endpoint/${id}`)
    return data
  },

  create: async (resource: CreateResourceDto): Promise<ResourceName> => {
    const { data } = await api.post<ResourceName>('/endpoint', resource)
    return data
  },

  update: async (id: number, resource: UpdateResourceDto): Promise<ResourceName> => {
    const { data } = await api.put<ResourceName>(`/endpoint/${id}`, resource)
    return data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/endpoint/${id}`)
  },
}
```

### 2. Component Structure (`app/[page-name]/_components/`)

Create a `_components` directory inside the page folder containing:

#### a. `create-dialog.tsx` - Create Dialog Component

**Pattern:**
- Use shadcn Dialog with DialogTrigger pattern
- React Hook Form with Zod validation
- TanStack Query mutation for create operation
- Form wraps both DialogTrigger and DialogContent
- DialogContent max-width: `sm:max-w-[425px]`
- Use DialogClose for Cancel button
- Query invalidation on success

**Key Structure:**
```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const schema = z.object({
  field1: z.string().min(1, 'Field is required'),
  // ... validation rules
})

export function CreateDialog() {
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const createMutation = useMutation({
    mutationFn: (data) => api.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource-key'] })
      reset()
    },
  })

  return (
    <Dialog>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <Button>Create [Resource]</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          {/* Form fields */}
        </DialogContent>
      </form>
    </Dialog>
  )
}
```

#### b. `edit-dialog.tsx` - Edit Dialog Component

**Pattern:**
- Similar structure to CreateDialog
- Accepts resource as prop
- useEffect to reset form when resource changes
- DialogTrigger is an icon button (Pencil icon)
- Pre-populate form with existing data

**Key Structure:**
```typescript
'use client'

import { useEffect } from 'react'
import { Pencil } from 'lucide-react'

interface EditDialogProps {
  resource: ResourceType
}

export function EditDialog({ resource }: EditDialogProps) {
  const { reset } = useForm({
    defaultValues: { ...resource }
  })

  useEffect(() => {
    reset({ ...resource })
  }, [resource, reset])

  return (
    <Dialog>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          {/* Form fields */}
        </DialogContent>
      </form>
    </Dialog>
  )
}
```

### 3. Page Implementation (`app/[page-name]/page.tsx`)

**Required Features:**
- 'use client' directive
- TanStack Query for data fetching
- shadcn Table for data display
- Loading and error states
- Delete mutation with confirmation
- Import dialogs from `_components`

**Standard Structure:**
```typescript
'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { resourceApi } from '@/lib/api'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CreateDialog } from './_components/create-dialog'
import { EditDialog } from './_components/edit-dialog'
import { Trash2 } from 'lucide-react'

export default function PageName() {
  const queryClient = useQueryClient()

  const { data: resources, isLoading, error } = useQuery({
    queryKey: ['resource-key'],
    queryFn: resourceApi.getAll,
  })

  const deleteMutation = useMutation({
    mutationFn: resourceApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource-key'] })
    },
  })

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this?')) {
      deleteMutation.mutate(id)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg text-destructive">Error: {error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">[Page Title]</h1>
        <CreateDialog />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {/* Table headers */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources?.length ? (
              resources.map((resource) => (
                <TableRow key={resource.id}>
                  {/* Table cells */}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <EditDialog resource={resource} />
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(resource.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columnCount} className="h-24 text-center">
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
```

### 4. Pagination (Optional - Based on API Response)

**When to Include:**
- If API returns all data at once (client-side pagination)
- If API provides pagination metadata

**Client-Side Pagination Pattern:**
```typescript
const ITEMS_PER_PAGE = 10
const [currentPage, setCurrentPage] = useState(1)

const { paginatedData, totalPages } = useMemo(() => {
  if (!data) return { paginatedData: [], totalPages: 0 }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedData = data.slice(startIndex, endIndex)
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE)

  return { paginatedData, totalPages }
}, [data, currentPage])
```

Add pagination UI below the table with shadcn Pagination component.

## Dialog Form Pattern

### Form Field Structure
```typescript
<div className="grid gap-4">
  <div className="grid gap-3">
    <Label htmlFor="field-id">Field Label</Label>
    <Input
      id="field-id"
      placeholder="Enter value"
      {...register('fieldName')}
      aria-invalid={!!errors.fieldName}
    />
    {errors.fieldName && (
      <p className="text-sm text-destructive">{errors.fieldName.message}</p>
    )}
  </div>
</div>
```

### Dialog Footer
```typescript
<DialogFooter>
  <DialogClose asChild>
    <Button type="button" variant="outline" disabled={mutation.isPending}>
      Cancel
    </Button>
  </DialogClose>
  <Button type="submit" disabled={mutation.isPending}>
    {mutation.isPending ? 'Saving...' : 'Save'}
  </Button>
</DialogFooter>
```

## Key Principles

1. **Always use 'use client' directive** for pages with interactivity
2. **Dialog pattern**: Form wraps DialogTrigger and DialogContent
3. **Validation**: Use Zod schemas with React Hook Form
4. **State management**: TanStack Query for server state
5. **Component separation**: Dialogs in `_components` directory
6. **TypeScript**: Full type safety with interfaces
7. **Error handling**: Display loading and error states
8. **Confirmation**: Always confirm destructive actions (delete)
9. **Query invalidation**: Refresh data after mutations
10. **Accessibility**: Use aria-invalid, proper labels, and semantic HTML

## File Structure Template

```
app/
└── [page-name]/
    ├── _components/
    │   ├── create-dialog.tsx
    │   └── edit-dialog.tsx
    └── page.tsx

lib/
└── api.ts (extend with new resource API)
```

## Dependencies Used

- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling
- **zod**: Schema validation
- **@hookform/resolvers**: Zod integration with React Hook Form
- **axios**: HTTP client
- **shadcn/ui components**: Dialog, Table, Button, Input, Label, Pagination
- **lucide-react**: Icons

## Notes

- Pagination is optional and should be implemented based on API response structure
- If API provides server-side pagination, adapt the pattern accordingly
- Always match the dialog structure exactly as shown (form wrapping trigger and content)
- Use consistent naming conventions for query keys matching the resource name
- Keep components focused and single-responsibility
