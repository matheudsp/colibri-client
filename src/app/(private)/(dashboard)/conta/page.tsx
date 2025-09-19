"use client";

import { Shield, Wallet, User, Loader2 } from "lucide-react";
import { TabbedInterface, TabItem } from "@/components/common/TabbedInterface";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Roles } from "@/constants";
import { useCallback, useMemo } from "react";
import { AccountTab } from "@/components/tabs/AccountTab";
import { SecurityTab } from "@/components/tabs/SecurityTab";
import { PaymentAccountTab } from "@/components/tabs/PaymentAccountTab";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function AccountPage() {
  const { role, loading: isRoleLoading } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
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
        id: "conta-de-pagamentos",
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
      if (tab.id === "conta-de-pagamentos") {
        return role === Roles.LOCADOR || role === Roles.ADMIN;
      }
      return true;
    });
  }, [role, isRoleLoading, allAccountTabs]);

  const activeTabId = useMemo(() => {
    const tabParam = searchParams.get("aba");
    const isTabAccessible = accessibleTabs.some((tab) => tab.id === tabParam);

    if (isTabAccessible) {
      return tabParam;
    }
    return accessibleTabs.length > 0 ? accessibleTabs[0].id : undefined;
  }, [searchParams, accessibleTabs]);

  const handleTabChange = useCallback(
    (tabId: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("aba", tabId);
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

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
        {activeTabId ? (
          <TabbedInterface
            tabs={accessibleTabs}
            activeTabId={activeTabId}
            onTabChange={handleTabChange}
            title="Minha Conta"
          />
        ) : (
          <p className="text-center text-muted-foreground">
            Nenhuma opção disponível para sua conta.
          </p>
        )}
      </div>
    </div>
  );
}
