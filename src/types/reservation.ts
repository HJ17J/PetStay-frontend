export interface Reservation {
  sittername: string;
  date: string;
  price: number;
}

export interface UserData {
  name: string;
  usertype: string;
  resvData: Reservation[];
}
