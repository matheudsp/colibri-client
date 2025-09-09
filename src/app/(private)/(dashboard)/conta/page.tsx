"use client";

import { FileText, Shield, HandCoins } from "lucide-react";
import { TabbedInterface, TabItem } from "@/components/common/TabbedInterface";
import { AccountForm } from "@/components/forms/account/AccountForm";
import { SecurityForm } from "@/components/forms/account/SecurityForm";
import { PaymentAccountForm } from "@/components/forms/account/PaymentAccountForm";

const accountTabs: TabItem[] = [
  {
    id: "perfil",
    title: "Perfil",
    icon: <FileText size={18} />,
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
    title: "Conta de Pagamentos",
    icon: <HandCoins size={18} />,
    content: <PaymentAccountForm />,
  },
];

export default function AccountPage() {
  return (
    <div className="min-h-svh flex flex-col items-center pt-8 md:pt-14 px-4 pb-24 bg-gray-50">
      <div className="w-full max-w-5xl mx-auto">
        <TabbedInterface tabs={accountTabs} title="Minha Conta" />
      </div>
    </div>
  );
}
