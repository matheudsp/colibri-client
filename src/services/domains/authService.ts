import { ApiResponse } from "../../types/api";
import { api } from "../api";
import API_ROUTES from "../api/routes";

interface LoginData {
  email?: string;
  password?: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    role: string;
    status: boolean;
  };
}

interface TenantRegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  cpfCnpj: string;
  birthDate: string | undefined;
}

interface LandlordRegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  cpfCnpj: string;
  cep: string;
  street: string;
  number: string;
  province: string;
  city: string;
  state: string;
  complement?: string;
  incomeValue: number;
  companyType?: string;
  birthDate?: string;
}

export interface UserData {
  id: string;
  name: string;
  email?: string;
  role: string;
  status: boolean;
}

export const AuthService = {
  async getMe(): Promise<ApiResponse<UserData>> {
    try {
      const response = await api.get(API_ROUTES.AUTH.ME);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async login(loginData: LoginData) {
    try {
      const response = await api.post(API_ROUTES.AUTH.LOGIN, loginData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async registerTenant(registerData: TenantRegisterData) {
    try {
      const response = await api.post(API_ROUTES.AUTH.REGISTER, registerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async registerLandlord(registerData: LandlordRegisterData) {
    console.log("Registering landlord with data:", registerData);
    try {
      const response = await api.post(
        API_ROUTES.AUTH.REGISTER_LANDLORD,
        registerData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
