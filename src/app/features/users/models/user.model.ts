import { UserAddress } from './address.interface';
import { User as IUser } from './user.interface';
export class User implements Omit<IUser, 'address'> {
  firstName: string;
  lastName: string;
  age: number;
  address: string;

  /**
   *
   */
  constructor(user: IUser) {
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.age = user.age;
    this.address = this.formatAddress(user.address);
  }

  formatAddress(userAddress: UserAddress): string {
    const {
      address,
      city,
      country,
      state,
      stateCode,
      postalCode,
      coordinates: { lat, lng },
    } = userAddress;
    return `${country},${state},${stateCode},${city},${address},${postalCode},coordinates:latitude:${lat},langtitude:${lng}`;
  }
}
