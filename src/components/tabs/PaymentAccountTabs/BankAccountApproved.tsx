"use client";

import { useState } from "react";
import { UserRoundCheck, Edit } from "lucide-react";
import { BankAccount } from "@/services/domains/bankAccountService";
import { TransfersTab } from "@/components/tabs/TransferTab";
import { CustomButton } from "@/components/forms/CustomButton";
import { UpdatePixKeyForm } from "@/components/forms/UpdatePixKeyForm";

interface BankAccountApprovedProps {
  account: BankAccount;
  onUpdate: () => void; // Prop para recarregar os dados
}

export function BankAccountApproved({
  account,
  onUpdate,
}: BankAccountApprovedProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="overflow-hidden">
      <div className="p-6 border-b border-border text-center">
        <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center shadow-xs mb-3">
          <UserRoundCheck className="text-green-600" size={40} />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Conta Verificada</h3>

        {!isEditing ? (
          <div className="mt-4 space-y-4">
            <p className="text-sm text-gray-600">
              Sua conta está aprovada. Os repasses serão enviados para a chave
              PIX abaixo:
            </p>
            <div className="inline-block bg-gray-100 border border-border rounded-lg px-4 py-2">
              <p className="text-xs text-gray-500">
                {account.bankAccount?.pixAddressKeyType}
              </p>
              <p className="font-mono font-semibold text-gray-800">
                {account.bankAccount?.pixAddressKey}
              </p>
            </div>
            <div>
              <CustomButton onClick={() => setIsEditing(true)} ghost>
                <Edit size={16} className="mr-2" />
                Alterar Chave PIX
              </CustomButton>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <UpdatePixKeyForm
              onSuccess={() => {
                setIsEditing(false);
                onUpdate();
              }}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        )}
      </div>

      <div className="py-6 md:px-6">
        <TransfersTab />
      </div>
    </div>
  );
}
