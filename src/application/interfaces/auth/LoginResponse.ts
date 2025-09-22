export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
}