import { UserAddress } from './address.interface';

export interface User {
  firstName: string;
  lastName: string;
  age: number;
  address: UserAddress;
}
