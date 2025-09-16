"use client";

import { UserRoundCheck } from "lucide-react";
import { BankAccount } from "@/services/domains/bankAccountService";
import { TransfersTab } from "@/components/tabs/TransferTab";

interface BankAccountApprovedProps {
  account: BankAccount;
}

export function BankAccountApproved({ account }: BankAccountApprovedProps) {
  return (
    <div className="overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex flex-col justify-center text-center">
        <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center shadow-sm mb-3">
          <UserRoundCheck className="text-green-600" size={40} />
        </div>
        {/* EXIBIR BOTAO PARA ALTERAR CHAVE PIX */}
        <h3 className="text-lg font-bold text-gray-800">Conta Verificada</h3>
        <p className="text-sm text-gray-600 mt-1">
          Sua conta está aprovada e pronta para receber transferências.
          {account.bankAccount?.pixAddressKey}
        </p>
      </div>

      <div className="py-6 md:px-6">
        <TransfersTab />
      </div>
    </div>
  );
}
