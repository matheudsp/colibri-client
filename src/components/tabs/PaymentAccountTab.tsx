"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  BankAccount,
  BankAccountService,
} from "@/services/domains/bankAccountService";
import { extractAxiosError } from "@/services/api";
import { BankAccountOnboarding } from "@/components/financial/BankAccountOnboarding";
import { BankAccountPending } from "@/components/financial/BankAccountPending";
import { BankAccountApproved } from "@/components/financial/BankAccountApproved";
import { BankAccountRejected } from "@/components/financial/BankAccountRejected";

export function PaymentAccountTab() {
  const [account, setAccount] = useState<BankAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await BankAccountService.findMyAccount();
      setAccount(response.data);
    } catch (error) {
      if (extractAxiosError(error).includes("404")) {
        setAccount(null);
      } else {
        toast.error("Erro ao carregar dados da conta.", {
          description: extractAxiosError(error),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const renderContent = () => {
    // CORREÇÃO APLICADA AQUI:
    // Verifica se a conta ou, mais importante, se a chave PIX (bankAccount) não existe.
    if (!account || !account.bankAccount) {
      return <BankAccountOnboarding onSuccess={fetchData} />;
    }

    switch (account.subAccount?.statusGeneral) {
      case "APPROVED":
        return <BankAccountApproved account={account} />;
      case "REJECTED":
        return <BankAccountRejected account={account} />;
      case "PENDING":
      default:
        return <BankAccountPending account={account} />;
    }
  };

  return (
    <div className="p-0 md:p-4 rounded-b-xl rounded-tr-xl">
      {renderContent()}
    </div>
  );
}
