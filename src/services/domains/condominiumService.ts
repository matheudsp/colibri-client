import { api, extractAxiosError } from "../api";
import API_ROUTES from "../api/routes";
import { ApiResponse } from "@/types/api";
import { CreateCondominiumFormValues } from "@/validations/condominiums/condominiumCreateValidation";

export interface Condominium {
  id: string;
  name: string;
  cep: string;
  street: string;
  number: string;
  province: string;
  city: string;
  state: string;
}

interface ListParams {
  page?: number;
  limit?: number;
}
interface SearchParams {
  title?: string;
  state?: string;
  city?: string;
}

export const CondominiumService = {
  async create(
    data: CreateCondominiumFormValues
  ): Promise<ApiResponse<Condominium>> {
    try {
      const response = await api.post(API_ROUTES.CONDOMINIUMS.CREATE, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async listAll(params?: ListParams): Promise<ApiResponse<Condominium[]>> {
    try {
      const response = await api.get(API_ROUTES.CONDOMINIUMS.BASE, {
        params: params,
      });
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  async search(params: SearchParams): Promise<ApiResponse<Condominium[]>> {
    try {
      const cleanedParams = Object.fromEntries(
        Object.entries(params).filter(
          ([value]) => value !== undefined && value !== null && value !== ""
        )
      );

      const response = await api.get(API_ROUTES.CONDOMINIUMS.SEARCH, {
        params: cleanedParams,
      });
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  async getById(id: string): Promise<ApiResponse<Condominium>> {
    try {
      const response = await api.get(API_ROUTES.CONDOMINIUMS.BY_ID({ id }));
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  async update(
    id: string,
    data: Partial<CreateCondominiumFormValues>
  ): Promise<ApiResponse<Condominium>> {
    try {
      const response = await api.patch(
        API_ROUTES.CONDOMINIUMS.UPDATE({ id }),
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(API_ROUTES.CONDOMINIUMS.DELETE({ id }));
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },
};
