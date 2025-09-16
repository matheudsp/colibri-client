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
    LOGIN_2FA: "/auth/login/2fa",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    REGISTER: "/auth/register",
    REGISTER_LANDLORD: "/auth/register/landlord",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    RESEND_VERIFICATION: "/auth/resend-verification",
    VERIFY_EMAIL: "/auth/verify-email",
  },
  TWO_FACTOR_AUTH: {
    ENABLE: "/2fa/enable",
    CONFIRM_ENABLE: "/2fa/confirm-enable",
    DISABLE: "/2fa/disable",
  },
  SUBACCOUNTS: {
    UPLOAD_DOCUMENT: "/subaccounts/documents/upload",
    PENDING_DOCUMENTS: "/subaccounts/documents/pending",
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
    ME: "/users/me",
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
    LIST_AVAILABLE_PUBLIC: "/properties/public",
    SEARCH: "/properties/search",
    PUBLIC_SEARCH: "/properties/public/search",
    CREATE: "/properties",
    BY_ID: ({ propertyId }: Params) => `/properties/${propertyId}`,
    UPDATE: ({ propertyId }: Params) => `/properties/${propertyId}`,
    DELETE: ({ propertyId }: Params) => `/properties/${propertyId}/delete`,
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
  TRANSFERS: {
    MANUAL_PAYOUT: "/transfers/manual-payout",
    MY_TRANSFERS: "/transfers/my-transfers",
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
  VERIFICATION: {
    REQUEST: "/verification/request",
    CONFIRM: "/verification/confirm",
  },
};

export default API_ROUTES;
