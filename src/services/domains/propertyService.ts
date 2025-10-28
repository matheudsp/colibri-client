// import { CreatePropertyFormValues } from "../../validations";
import { api, extractAxiosError } from "../api";
import API_ROUTES from "../api/routes";
import { PropertyProps } from "../../interfaces/property";
import { ApiResponse, type PropertiesApiResponse } from "../../types/api";
import type { PropertySearchFormValues } from "@/validations/properties/propertySearchValidation";
import type { Photo } from "@/interfaces/photo";

export interface PropertyResponse {
  id: string;
  title: string;
  description: string;
  transactionType: string;
  value: number;
  cep: string;
  street: string;
  province: string;
  city: string;
  state: string;
  number: string;
  complement: string | null;
  areaInM2: number;
  numRooms: number;
  numBathrooms: number;
  numParking: number;
  isAvailable: boolean;
  propertyType: string;
  condominiumId: string | null;
  landlordId: string;
  landlord: {
    name: string;
    cpfCnpj?: string;
    email: string;
    phone?: string;
  };
  photos: Photo[];
  createdAt: string;
  updatedAt: string;
  acceptOnlineProposals?: boolean;
  interestCount?: number;
}

interface PropertyCreateData {
  title: string;
  description: string;
  value: number;
  cep: string;
  street: string;
  province: string;
  city: string;
  state: string;
  number: string;
  complement?: string | null;
  areaInM2: number;
  numRooms: number;
  numBathrooms: number;
  numParking: number;
  isAvailable: boolean;
  condominiumId?: string | null;
}

interface ListPropertiesParams {
  page?: number;
  limit?: number;
}

interface SearchPropertiesParams {
  title?: string;
  state?: string;
  city?: string;
  q?: string;
  propertyType?: string;
  transactionType?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "rentValue";
  sortOrder?: "asc" | "desc";
}

export const PropertyService = {
  async create(
    data: PropertyCreateData
  ): Promise<ApiResponse<PropertyResponse>> {
    try {
      const response = await api.post(API_ROUTES.PROPERTIES.CREATE, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async listAll(
    params?: ListPropertiesParams
  ): Promise<{ data: PropertiesApiResponse }> {
    try {
      const response = await api.get(API_ROUTES.PROPERTIES.BASE, {
        params: params,
      });
      // console.log(response.data);
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },
  async listAvailable(
    params?: ListPropertiesParams
  ): Promise<PropertiesApiResponse> {
    try {
      const response = await api.get<ApiResponse<PropertiesApiResponse>>(
        API_ROUTES.PROPERTIES.LIST_AVAILABLE_PUBLIC,
        {
          params: params,
        }
      );

      return response.data.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  async listMostInterested(
    params?: ListPropertiesParams
  ): Promise<PropertiesApiResponse> {
    try {
      const response = await api.get<ApiResponse<PropertiesApiResponse>>(
        API_ROUTES.PROPERTIES.LIST_MOST_INTERESTED,
        {
          params: params,
        }
      );

      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch most interested properties:", error);
      throw new Error(extractAxiosError(error));
    }
  },

  async search(
    params: SearchPropertiesParams
  ): Promise<ApiResponse<PropertiesApiResponse>> {
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
  async publicSearch(
    params: Partial<PropertySearchFormValues>
  ): Promise<ApiResponse<PropertiesApiResponse>> {
    try {
      const response = await api.get(API_ROUTES.PROPERTIES.PUBLIC_SEARCH, {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },
  async getById(id: string): Promise<ApiResponse<PropertyProps>> {
    try {
      const response = await api.get(
        API_ROUTES.PROPERTIES.BY_ID({ propertyId: id })
      );
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  async update(
    id: string,
    data: Partial<PropertyCreateData>
  ): Promise<ApiResponse<PropertyProps>> {
    try {
      const response = await api.patch(
        API_ROUTES.PROPERTIES.UPDATE({ propertyId: id }),
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  async delete(
    id: string,
    actionToken: string
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      // console.log("CHAMANADO ROTA PARA DELETAR PROPERTY");
      const response = await api.post(
        API_ROUTES.PROPERTIES.DELETE({ propertyId: id }),
        {
          actionToken,
        }
      );
      // console.log("CHAMANADO ROTA PARA DELETAR PROPERTY", response.data);
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },
};
