"use client";

import { Shield, Wallet, User, Loader2 } from "lucide-react";
import { TabbedInterface, TabItem } from "@/components/common/TabbedInterface";
import { AccountForm } from "@/components/forms/account/AccountForm";
import { SecurityForm } from "@/components/forms/account/SecurityForm";
import { PaymentAccountForm } from "@/components/forms/account/PaymentAccountForm";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Roles } from "@/constants";
import { useMemo } from "react";

export default function AccountPage() {
  const { role, loading: isRoleLoading } = useCurrentUser();
  const allAccountTabs: TabItem[] = [
    {
      id: "perfil",
      title: "Perfil",
      icon: <User size={18} />,
      content: <AccountForm />,
    },
    {
      id: "seguranca",
      title: "Segurança",
      icon: <Shield size={18} />,
      content: <SecurityForm />,
    },

    {
      id: "payment-account",
      title: "Conta de Pagamento",
      icon: <Wallet size={18} />,
      content: <PaymentAccountForm />,
    },
  ];
  const accessibleTabs = useMemo(() => {
    if (isRoleLoading) {
      return [];
    }

    return allAccountTabs.filter((tab) => {
      if (tab.id === "payment-account") {
        return role === Roles.LOCADOR || role === Roles.ADMIN;
      }
      return true;
    });
  }, [role, isRoleLoading]);

  if (isRoleLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-svh flex flex-col items-center pt-8 md:pt-14 px-4 pb-24 bg-gray-50">
      <div className="w-full max-w-5xl mx-auto">
        <TabbedInterface tabs={accessibleTabs} title="Minha Conta" />
      </div>
    </div>
  );
}
