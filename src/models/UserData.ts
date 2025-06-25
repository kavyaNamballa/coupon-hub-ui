export interface UserData {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  mobileNumber?: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
