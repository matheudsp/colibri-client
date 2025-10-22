export interface VariableOptionNode {
  id: string;
  label: string;
  children?: VariableOptionNode[];
}

export interface NestedVariableData {
  landlord: {
    name: string;
    cpfCnpj: string;
    street: string;
    number: string;
    province: string;
    city: string;
    state: string;
  };
  property: {
    title: string;
    street: string;
    number: string;
    complement: string;
    district: string;
    city: string;
    state: string;
    cep: string;
    propertyType: string;
  };
  tenant: {
    name: string;
    cpfCnpj: string;
    email: string;
  };
  contract: {
    rentAmount: number;
    condoFee?: number;
    iptuFee?: number;
    securityDeposit?: number;
    guaranteeType: string;
    durationInMonths: number;
    startDate: string;

    endDate: string;
  };
  todayDate: string;
}

export interface EditorInitData {
  content: string;
  variables: VariableOptionNode[];
}
