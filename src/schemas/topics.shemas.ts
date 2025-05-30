import { ColorTypeFull } from '@/constants/colors.constants'

export interface TopicType {
  _id?: string
  topic: string
  text_color: ColorTypeFull
  background_color: ColorTypeFull
  created_at?: Date
  created_by: string
  updated_at?: Date
  updated_by?: string
}
