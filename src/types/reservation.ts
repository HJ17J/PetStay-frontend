export interface Reservation {
  sittername: string;
  date: string;
  price: number;
  resvidx: number;
  confirm: string;
  username: string;
  type: string;
  animalNumber: number;
  content: string;
}

export interface UserData {
  name: string;
  usertype: string;
  resvData: Reservation[];
}
