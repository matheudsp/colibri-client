export interface PropertyProps {
  id: string;
  title: string;
  description: string;
  // cep: string;
  // street: string;
  // district: string;
  // city: string;
  // state: string;
  // number: string;
  // complement: string | null;
  areaInM2: number;
  numRooms: number;
  numBathrooms: number;
  numParking: number;
  isAvailable: boolean;
  condominiumId: string | null;
  landlordId: string;
  landlord: {
    name: string;
    email: string;
  };
  onDelete?: (id: string) => void;
  // photos: Array<{
  //   id: string;
  //   propertyId: string;
  //   name?: string;
  //   filePath: string;
  //   isCover: boolean;
  //   signedUrl: string;
  // }>;
}
