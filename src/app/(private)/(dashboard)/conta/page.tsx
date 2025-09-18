"use client";

import { Shield, Wallet, User, Loader2 } from "lucide-react";
import { TabbedInterface, TabItem } from "@/components/common/TabbedInterface";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Roles } from "@/constants";
import { useMemo } from "react";
import { AccountTab } from "@/components/tabs/AccountTab";
import { SecurityTab } from "@/components/tabs/SecurityTab";
import { PaymentAccountTab } from "@/components/tabs/PaymentAccountTab";
// import { TransfersTab } from "@/components/tabs/TransferTab";

export default function AccountPage() {
  const { role, loading: isRoleLoading } = useCurrentUser();

  const allAccountTabs: TabItem[] = useMemo(
    () => [
      {
        id: "perfil",
        title: "Perfil",
        icon: <User size={18} />,
        content: <AccountTab />,
      },
      {
        id: "seguranca",
        title: "Segurança",
        icon: <Shield size={18} />,
        content: <SecurityTab />,
      },

      {
        id: "payment-account",
        title: "Conta de Pagamento",
        icon: <Wallet size={18} />,
        content: <PaymentAccountTab />,
      },
      // {
      //   id: "transfers",
      //   title: "Transferências",
      //   icon: <BanknoteArrowDown size={16} />,
      //   content: <TransfersTab />,
      // },
    ],
    []
  );

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
  }, [role, isRoleLoading, allAccountTabs]);

  if (isRoleLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-svh flex flex-col items-center pt-8 md:pt-14 px-4 pb-24 ">
      <div className="w-full max-w-5xl mx-auto">
        <TabbedInterface tabs={accessibleTabs} title="Minha Conta" />
      </div>
    </div>
  );
}
