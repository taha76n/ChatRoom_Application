export interface User {
  id: string,
  userName: string
}

export interface Message {
  user: User,
  message: string,
  timeStamps: Date
}