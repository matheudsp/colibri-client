import { ApiResponse, MessageResponse } from "../../types/api";
import { api } from "../api";
import API_ROUTES from "../api/routes";

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
  email: string;
  role: string;
  status: boolean;
  emailVerified: boolean;
  isTwoFactorEnabled: boolean;
  isTwoFactorAuthenticated?: boolean;
}
interface ForgotPasswordData {
  email: string;
}

interface LoginData {
  email?: string;
  password?: string;
}

export interface TwoFactorRequiredResponse {
  twoFactorRequired: true;
  partialToken: string;
}

export type LoginPayload = MessageResponse | TwoFactorRequiredResponse;

interface Login2FAData {
  partialToken: string;
  code: string;
}
export type LoginResponse = MessageResponse | TwoFactorRequiredResponse;
export const AuthService = {
  async forgotPassword(
    data: ForgotPasswordData
  ): Promise<ApiResponse<MessageResponse>> {
    try {
      const response = await api.post(API_ROUTES.AUTH.FORGOT_PASSWORD, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async resetPassword(
    password: string,
    token: string
  ): Promise<ApiResponse<MessageResponse>> {
    try {
      const response = await api.post(API_ROUTES.AUTH.RESET_PASSWORD, {
        newPassword: password,
        token,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async getMe(): Promise<ApiResponse<UserData>> {
    try {
      const response = await api.get(API_ROUTES.AUTH.ME, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async login(loginData: LoginData): Promise<LoginPayload> {
    try {
      const response = await api.post<ApiResponse<LoginPayload>>(
        API_ROUTES.AUTH.LOGIN,
        loginData
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  async loginWith2FA(
    data: Login2FAData
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await api.post(API_ROUTES.AUTH.LOGIN_2FA, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async logout() {
    try {
      await api.post(API_ROUTES.AUTH.LOGOUT);
    } catch (error) {
      // Mesmo que falhe, tentamos limpar o estado do lado do cliente
      console.error("Logout failed", error);
    }
  },

  async refreshToken() {
    return api.post(API_ROUTES.AUTH.REFRESH);
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
