export interface Reservation {
  date: string;
  price: number;
  resvidx: number;
  confirm: string;
  type: string;
  animalNumber: number;
  content: string;
  User: {
    name: string; // 사용자의 이름 속성
  };
}
export interface UserData {
  name: string;
  usertype: string;
  resvData: Reservation[];
}
