import { UserType } from "./authTypes";

export interface CommonUserInterface {
  useridx?: number;
  userid?: string;
  userpw?: string;
  name?: string;
  address?: string;
  img?: string;
  usertype?: UserType;
}
