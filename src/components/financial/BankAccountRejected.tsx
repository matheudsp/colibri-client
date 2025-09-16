"use client";

import { AlertTriangle } from "lucide-react";
import { BankAccount } from "@/services/domains/bankAccountService";
import { CustomButton } from "../forms/CustomButton";

interface BankAccountRejectedProps {
  account: BankAccount;
}

export function BankAccountRejected({ account }: BankAccountRejectedProps) {
  const onboardingUrl = account.subAccount?.onboardingUrl;

  return (
    <div className="p-6 border-t md:border-t-0 border-gray-200 flex flex-col justify-center text-center">
      <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center shadow-sm mb-3">
        <AlertTriangle className="text-red-600" size={24} />
      </div>
      <h3 className="text-lg font-bold text-gray-800">
        Pendência na Verificação
      </h3>
      <p className="text-sm text-gray-600 mt-1">
        Houve um problema com a verificação dos seus dados ou documentos. Por
        favor, acesse o link abaixo para corrigir as pendências.
      </p>
      {onboardingUrl && (
        <CustomButton
          onClick={() => window.open(onboardingUrl, "_blank")}
          className="mt-4"
          color="bg-red-600"
          textColor="text-white"
        >
          Resolver Pendências
        </CustomButton>
      )}
    </div>
  );
}
