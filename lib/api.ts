import axios from 'axios'

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface Post {
  userId: number
  id: number
  title: string
  body: string
}

export interface CreatePostDto {
  title: string
  body: string
  userId: number
}

export interface UpdatePostDto {
  title: string
  body: string
}

export const postsApi = {
  getAll: async (): Promise<Post[]> => {
    const { data } = await api.get<Post[]>('/posts')
    return data
  },

  getById: async (id: number): Promise<Post> => {
    const { data } = await api.get<Post>(`/posts/${id}`)
    return data
  },

  create: async (post: CreatePostDto): Promise<Post> => {
    const { data } = await api.post<Post>('/posts', post)
    return data
  },

  update: async (id: number, post: UpdatePostDto): Promise<Post> => {
    const { data } = await api.put<Post>(`/posts/${id}`, post)
    return data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/posts/${id}`)
  },
}

export default api
