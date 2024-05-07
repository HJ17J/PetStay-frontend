export interface PetSitterList {
  useridx: number;
  name: string;
  img: string;
  address: string;
  shortIntro: string;
  pay: number;
  rating: number;
  reviewCount: number;
  animalType: string[];
}

export interface PetSitterDetail {
  useridx: number;
  name: string;
  img: string;
  address: string;
  shortIntro: string;
  selfIntroduction: string;
  career: string;
  license: string;
  pay: number;
  animalType: string[];
  rating: number;
  reviewCount: number;
}
