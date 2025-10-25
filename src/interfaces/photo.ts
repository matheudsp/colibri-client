export interface Photo {
  id?: string;
  propertyId?: string;
  name?: string;
  filePath?: string;
  isCover?: boolean;
  file?: File;
  // signedUrl?: string;
  tempUrl?: string;
  property?: {
    id: string;
    title: string;
  };
  url?: string;
}
