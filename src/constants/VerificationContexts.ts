/**
 * Define os contextos para ações críticas que exigem verificação por OTP.
 * Isso garante consistência entre o frontend e o backend.
 */
export const VerificationContexts = {
  PIX_KEY_UPDATE: "PIX_KEY_UPDATE",
  DELETE_PROPERTY: "DELETE_PROPERTY",
  CANCEL_CONTRACT: "CANCEL_CONTRACT",
  LOGIN_2FA: "LOGIN_2FA",
  DISABLE_2FA: "DISABLE_2FA",
  UPDATE_USER_PROFILE: "UPDATE_USER_PROFILE",
} as const;

// Gera um tipo TypeScript a partir das chaves do objeto acima.VerificationContexts
export type VerificationContext =
  (typeof VerificationContexts)[keyof typeof VerificationContexts];
