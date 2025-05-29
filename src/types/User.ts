export interface User {
  id: string;
  refresh_token: string;
  username: string;
  fullName: string;
  phoneNumber: string;
  gender: string;
  birthday?: string;
  address: string;
  role: string;
  image: string;
}
