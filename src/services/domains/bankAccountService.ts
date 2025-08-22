import { api, extractAxiosError } from "../api";
import API_ROUTES from "../api/routes";
import { ApiResponse } from "@/types/api";
import { CreateBankAccountFormValues } from "@/validations/bankAccounts/bankAccountCreateValidation";

export interface BankAccount {
  id: string;
  bank: string;
  agency: string;
  account: string;
  accountType: "CONTA_CORRENTE" | "CONTA_POUPANCA";
  userId: string;
}

export interface Balance {
  balance: number;
}

export const BankAccountService = {
  async create(
    data: CreateBankAccountFormValues
  ): Promise<ApiResponse<BankAccount>> {
    try {
      const response = await api.post(API_ROUTES.BANK_ACCOUNTS.BASE, data);
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  async findMyAccount(): Promise<ApiResponse<BankAccount>> {
    try {
      const response = await api.get(API_ROUTES.BANK_ACCOUNTS.MY_ACCOUNT);
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  async update(
    data: CreateBankAccountFormValues
  ): Promise<ApiResponse<BankAccount>> {
    try {
      const response = await api.patch(API_ROUTES.BANK_ACCOUNTS.UPDATE, data);
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  async getBalance(): Promise<ApiResponse<Balance>> {
    try {
      const response = await api.get(API_ROUTES.BANK_ACCOUNTS.BALANCE);
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },
};
