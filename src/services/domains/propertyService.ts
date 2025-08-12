import { CreatePropertyFormValues } from "../../validations";
import { api, extractAxiosError } from "../api";
import API_ROUTES from "../api/routes";
import { PropertyProps } from "../../interfaces/property";
import { ApiResponse } from "../../types/api";

export interface Property {
  id: string;
  title: string;
  description: string;
  rentAmount: number;

  cep: string;
  street: string;
  district: string;
  city: string;
  state: string;
  number: string;
  complement: string | null;
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
    phone: string;
  };
  photos: Array<{
    id: string;
    propertyId: string;
    name?: string;
    filePath: string;
    isCover: boolean;
    signedUrl: string;
  }>;
}

interface ListPropertiesParams {
  page?: number;
  limit?: number;
}

interface SearchPropertiesParams {
  title?: string;
  state?: string;
  city?: string;
}

export const PropertyService = {
  async create(data: CreatePropertyFormValues): Promise<ApiResponse<Property>> {
    try {
      const response = await api.post(API_ROUTES.PROPERTIES.CREATE, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async listAll(
    params?: ListPropertiesParams
  ): Promise<ApiResponse<Property[]>> {
    try {
      const response = await api.get(API_ROUTES.PROPERTIES.BASE, {
        params: params,
      });
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  async search(
    params: SearchPropertiesParams
  ): Promise<ApiResponse<Property[]>> {
    try {
      const cleanedParams = Object.fromEntries(
        Object.entries(params).filter(
          ([value]) => value !== undefined && value !== null && value !== ""
        )
      );

      const response = await api.get(API_ROUTES.PROPERTIES.SEARCH, {
        params: cleanedParams,
      });
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  async getById(id: string): Promise<ApiResponse<PropertyProps>> {
    try {
      const response = await api.get(API_ROUTES.PROPERTIES.BY_ID({ id }));
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  async update(
    id: string,
    data: Partial<CreatePropertyFormValues>
  ): Promise<ApiResponse<PropertyProps>> {
    try {
      const response = await api.patch(
        API_ROUTES.PROPERTIES.UPDATE({ id }),
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(API_ROUTES.PROPERTIES.DELETE({ id }));
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },
};
