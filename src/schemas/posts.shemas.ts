export interface PostType {
  _id?: string
  title: string
  summary?: string
  content: string
  user: string
  url: string
  topic: string
  created_at?: Date
  created_by?: string
  updated_at?: Date
  updated_by?: string
}
