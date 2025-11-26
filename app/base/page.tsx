'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { postsApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination'
import { CreateDialog } from './_components/create-dialog'
import { EditDialog } from './_components/edit-dialog'
import { Trash2 } from 'lucide-react'

const ITEMS_PER_PAGE = 10

export default function BasePage() {
    const queryClient = useQueryClient()
    const [currentPage, setCurrentPage] = useState(1)

    const { data: posts, isLoading, error } = useQuery({
        queryKey: ['posts'],
        queryFn: postsApi.getAll,
    })

    const deleteMutation = useMutation({
        mutationFn: postsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        },
    })

    // Calculate pagination
    const { paginatedPosts, totalPages } = useMemo(() => {
        if (!posts) return { paginatedPosts: [], totalPages: 0 }

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
        const endIndex = startIndex + ITEMS_PER_PAGE
        const paginatedPosts = posts.slice(startIndex, endIndex)
        const totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE)

        return { paginatedPosts, totalPages }
    }, [posts, currentPage])

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this post?')) {
            deleteMutation.mutate(id)
        }
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = []
        const maxVisible = 5

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i)
                }
                pages.push('ellipsis')
                pages.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1)
                pages.push('ellipsis')
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i)
                }
            } else {
                pages.push(1)
                pages.push('ellipsis')
                pages.push(currentPage - 1)
                pages.push(currentPage)
                pages.push(currentPage + 1)
                pages.push('ellipsis')
                pages.push(totalPages)
            }
        }

        return pages
    }

    if (isLoading) {
        return (
            <div className="container mx-auto p-8">
                <div className="flex items-center justify-center min-h-screen">
                    <p className="text-lg">Loading posts...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto p-8">
                <div className="flex items-center justify-center min-h-screen">
                    <p className="text-lg text-destructive">Error loading posts: {error.message}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Posts</h1>
                <CreateDialog />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead className="w-[100px]">User ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Body</TableHead>
                            <TableHead className="w-[120px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedPosts?.length ? (
                            paginatedPosts.map((post) => (
                                <TableRow key={post.id}>
                                    <TableCell className="font-medium">{post.id}</TableCell>
                                    <TableCell>{post.userId}</TableCell>
                                    <TableCell className="font-semibold">{post.title}</TableCell>
                                    <TableCell className="max-w-md truncate">{post.body}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <EditDialog post={post} />
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => handleDelete(post.id)}
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
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No posts found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, posts?.length || 0)} of {posts?.length || 0} posts
                    </p>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                            </PaginationItem>

                            {getPageNumbers().map((page, index) => (
                                <PaginationItem key={index}>
                                    {page === 'ellipsis' ? (
                                        <PaginationEllipsis />
                                    ) : (
                                        <PaginationLink
                                            onClick={() => handlePageChange(page as number)}
                                            isActive={currentPage === page}
                                            className="cursor-pointer"
                                        >
                                            {page}
                                        </PaginationLink>
                                    )}
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    )
}
