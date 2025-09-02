type Params = {
  id?: string;
  userId?: string;
  contractId?: string;
  documentId?: string;
  propertyId?: string;
};

const API_ROUTES = {
  METRICS: "/metrics",

  AUTH: {
    ME: "/auth/me",
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    REGISTER: "/auth/register",
    REGISTER_LANDLORD: "/auth/register/landlord",
  },

  LOGS: {
    BASE: "/logs",
    SEARCH: "/logs/search",
    USER_LOGS: ({ userId }: Params) => `/logs/user/${userId}`,
  },

  PHOTOS: {
    UPLOAD: ({ propertyId }: Params) => `/photos/upload/${propertyId}`,
    BY_PROPERTY: ({ propertyId }: Params) => `/photos/property/${propertyId}`,
    SIGNED_URL: ({ id }: Params) => `/photos/${id}/signed-url`,
    UPDATE: ({ id }: Params) => `/photos/${id}`,
    DELETE: ({ id }: Params) => `/photos/${id}`,
  },

  USERS: {
    BASE: "/users",
    SEARCH: "/users/search",
    BY_ID: ({ id }: Params) => `/users/${id}`,
    UPDATE: ({ id }: Params) => `/users/${id}`,
    DELETE: ({ id }: Params) => `/users/${id}`,
  },

  PDFS: {
    BASE: "/pdfs",
    GENERATE: "/pdfs/generate",

    SIGN: ({ id }: Params) => `/pdfs/${id}/sign`,
    BY_CONTRACT: ({ contractId }: Params) => `/pdfs/contract/${contractId}`,
    BY_ID: ({ id }: Params) => `/pdfs/${id}`,
    SIGNED_URL: ({ id }: Params) => `/pdfs/${id}/signed-url`,
    DOWNLOAD: ({ id }: Params) => `/pdfs/${id}/download`,
    DELETE: ({ id }: Params) => `/pdfs/${id}`,
  },
  PROPERTIES: {
    BASE: "/properties",
    SEARCH: "/properties/search",
    CREATE: "/properties",
    BY_ID: ({ id }: Params) => `/properties/${id}`,
    UPDATE: ({ id }: Params) => `/properties/${id}`,
    DELETE: ({ id }: Params) => `/properties/${id}`,
  },
  BANKSLIP: {
    BASE: "/bank-slips",
    GENERATE: "/bank-slips/generate",
  },
  DOCUMENTS: {
    BASE: "/documents",
    UPLOAD: ({ contractId }: Params) =>
      `/documents/contracts/${contractId}/upload`,

    BY_CONTRACT: ({ contractId }: Params) =>
      `/documents/contracts/${contractId}/documents`,

    UPDATE: ({ documentId }: Params) => `/documents/${documentId}`,
  },

  CONDOMINIUMS: {
    BASE: "/condominiums",
    SEARCH: "/condominiums/search",
    CREATE: "/condominiums",
    BY_ID: ({ id }: Params) => `/condominiums/${id}`,
    UPDATE: ({ id }: Params) => `/condominiums/${id}`,
    DELETE: ({ id }: Params) => `/condominiums/${id}`,
  },
  CONTRACTS: {
    BASE: "/contracts",
    CREATE: "/contracts",
    REQUEST_SIGNATURE: ({ id }: Params) => `/contracts/${id}/request-signature`,
    VIEW_PDF_URL: ({ id }: Params) => `/contracts/${id}/pdf-url`,
    BY_ID: ({ id }: Params) => `/contracts/${id}`,
    UPDATE: ({ id }: Params) => `/contracts/${id}`,
    DELETE: ({ id }: Params) => `/contracts/${id}`,
    ACTIVATE: ({ id }: Params) => `/contracts/${id}/activate`,
    CANCEL: ({ id }: Params) => `/contracts/${id}/cancel`,
    RESEND_NOTIFICATION: ({ id }: Params) =>
      `/contracts/${id}/resend-notification`,
  },
  PAYMENTS: {
    MY_PAYMENTS: "/payments-orders/my-payments",
    USER_PAYMENTS: "/payments-orders/user-payments",
    BY_ID: ({ id }: Params) => `/payments-orders/${id}`,
    BY_CONTRACT: ({ id }: Params) => `/payments-orders/contracts/${id}`,
    REGISTER: ({ id }: Params) => `/payments-orders/${id}`,
  },

  BANK_ACCOUNTS: {
    BASE: "/bank-accounts",
    BALANCE: "/bank-accounts/balance",
    MY_ACCOUNT: "/bank-accounts/my-account",
    UPDATE: "/bank-accounts",
  },
};

export default API_ROUTES;
