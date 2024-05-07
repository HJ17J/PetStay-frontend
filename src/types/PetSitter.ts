import { UserType } from "./authTypes";

export interface PetSitterList {
  useridx: number;
  name: string;
  img: string;
  address: string;
  oneLineIntro: string;
  pay: number;
  rating: number;
  reviewCount: number;
  // shortInfo: string;
  animalType: string;
}

export interface PetSitterDetail {
  useridx: number;
  name: string;
  img: string;
  address: string;
  oneLineIntro: string;
  selfIntroduction: string;
  career: string;
  license: string;
  pay: number;
  rating: number;
  reviewCount: number;
  animalType: string;
}


export interface ProfileResponse {
  address?: string;
  career?: string;
  confirm?: boolean;
  id?: number;
  img?: string;
  license?: string;
  name?: string;
  oneLineIntro?: string;
  pay?: number;
  selfIntroduction?: string;
  type?: string;
  userid?: string;
  useridx?: number;
  userpw?: string;
  usertype?: UserType;
}
