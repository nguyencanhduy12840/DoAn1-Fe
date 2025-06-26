export interface User {
  id: string;
  username: string;
  fullName: string;
  phoneNumber: string;
  gender: string;
  birthday?: string;
  address: string;
  roleEntity: {
    id: string;
    name: string;
    description?: string;
  };
  image: string;
}
