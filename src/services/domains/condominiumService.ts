import { api } from "../api";
import API_ROUTES from "../api/routes";
import { ApiResponse } from "@/types/api";
import { CreateCondominiumFormValues } from "@/validations/condominiums/condominiumCreateValidation";

export interface Condominium {
  id: string;
  name: string;
  cep: string;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
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
};
