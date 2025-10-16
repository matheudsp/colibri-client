"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  BankAccount,
  BankAccountService,
} from "@/services/domains/bankAccountService";
import { extractAxiosError } from "@/services/api";
import { BankAccountOnboarding } from "@/components/tabs/PaymentAccountTabs/BankAccountOnboarding";
import { BankAccountPending } from "@/components/tabs/PaymentAccountTabs/BankAccountPending";
import { BankAccountApproved } from "@/components/tabs/PaymentAccountTabs/BankAccountApproved";
import { BankAccountRejected } from "@/components/tabs/PaymentAccountTabs/BankAccountRejected";
import { BankAccountAwaitingApproval } from "./PaymentAccountTabs/BankAccountAwaitingApproval";

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
    if (!account || !account.bankAccount) {
      return <BankAccountOnboarding onSuccess={fetchData} />;
    }

    switch (account.subAccount?.statusGeneral) {
      case "APPROVED":
        return <BankAccountApproved account={account} onUpdate={fetchData} />;
      case "REJECTED":
        return <BankAccountRejected account={account} />;
      case "PENDING_ADMIN_APPROVAL":
        return <BankAccountAwaitingApproval account={account} />;
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
