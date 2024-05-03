export interface Reservation {
  sittername: string;
  date: string;
  price: number;
  resvidx: number;
  confirm: string;
}

export interface UserData {
  name: string;
  usertype: string;
  resvData: Reservation[];
}
