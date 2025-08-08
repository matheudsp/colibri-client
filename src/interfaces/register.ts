import { companyType } from "../constants";

export type CompanyType = (typeof companyType)[number]["value"];

export interface TenantRegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  cpfCnpj: string;
  phone: string;
  birthDate: string;
}

export interface LandlordRegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  cpfCnpj: string;
  cep: string;
  street: string;
  number: string;
  province: string;
  city: string;
  state: string;
  complement?: string;
  incomeValue?: number;
  companyType?: CompanyType;
  birthDate?: string; // Formato "YYYY-MM-DD"
}
