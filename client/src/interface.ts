export interface User {
  id: string,
  userName: string
}

export interface LoginProps {
  onLogin: (userName: string)  => void
}