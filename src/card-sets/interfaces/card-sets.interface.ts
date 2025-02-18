export interface CardSetAndPack {
  id: number;
  name: string;
  logo: string;
  image: string;
  packs: PackData[];
}

interface PackData {
  id: number;
  image: string;
}
