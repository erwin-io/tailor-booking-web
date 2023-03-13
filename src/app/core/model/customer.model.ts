import { Gender } from "./gender.model";
import { User } from "./user.model";

export class Customer {
  customerId: string;
  firstName: string;
  middleName?: any;
  lastName: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  address: string;
  birthDate: string;
  age: string;
  gender: Gender;
  user: User;
}
