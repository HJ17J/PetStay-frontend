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
