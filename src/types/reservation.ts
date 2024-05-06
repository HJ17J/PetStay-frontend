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
export interface ReservationInfo {
  resvidx: number;
  date: Date;
  startTime: number;
  endTime: number;
  content: string;
  sitteridx: number;
  useridx: number;
  animalType: string;
  animalNumber: number;
  price: number;
  confirm: "request" | "approved" | "refused" | "done";
  createdAt: Date;
  updatedAt: Date;
}
