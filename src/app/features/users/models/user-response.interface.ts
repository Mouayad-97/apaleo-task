import { PaginationData } from '@core/models';
import { User } from './user.interface';

export interface UserResponse extends PaginationData {
  users: User[];
}
