export interface PropertyProps {
  id: string;
  title: string;
  description: string;
  transactionType: string;
  value: number;
  cep: string;
  street: string;
  district: string;
  city: string;
  state: string;
  number: string;
  complement: string | null;
  areaInM2: number;
  numRooms: number;
  propertyType: string;
  numBathrooms: number;
  numParking: number;
  isAvailable: boolean;
  condominiumId: string | null;
  landlordId: string;
  landlord: {
    name: string;
    email: string;
    phone?: string;
  };
  createdAt: string;
  updatedAt: string;
  acceptOnlineProposals?: boolean;
  showPropertyInformation?: boolean;
  onDelete?: (id: string) => void;
  photos: Array<{
    id: string;
    propertyId: string;
    name?: string;
    filePath: string;
    isCover: boolean;
    url: string;
  }>;
  variant?: "dashboard" | "public";
}
