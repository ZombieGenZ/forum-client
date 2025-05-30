export interface UserType {
  _id?: string
  display_name?: string
  username: string
  email: string
  phone: string
  password: string
  user_type?: number | string
  user_role?: number | string
  is_verified?: boolean
  verify_token?: string
  forget_password_token?: string
  created_at?: Date
  updated_at?: Date
}
