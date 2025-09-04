"use client";

import { CreditCard, UserCog } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Roles } from "@/constants";
import { NavigationCard } from "@/components/cards/NavigationCard";

export default function AccountPage() {
  const { loading, role, sub, status } = useCurrentUser();
  console.log(loading, role, sub, status);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-28 pb-10">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Minha Conta
          </h1>

          <p className="text-gray-500 mt-1">
            Gerencie suas informações pessoais e financeiras.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NavigationCard
            href="/conta/perfil"
            title="Meus Dados"
            icon={<UserCog size={32} className="text-primary mx-auto" />}
          />
          {role === Roles.LOCADOR && (
            <NavigationCard
              href="/conta/financeiro"
              title="Dados Financeiros"
              icon={<CreditCard size={32} className="text-primary mx-auto" />}
            />
          )}
        </div>
        {process.env.NODE_ENV === "development" && (
          <div className="p-3 mt-4 rounded-md bg-gray-100 border border-gray-300 text-sm font-mono text-gray-700">
            <p>
              <strong>Sub:</strong> {sub}
            </p>
            <p>
              <strong>Role:</strong> {role}
            </p>
            <p>
              <strong>isActive:</strong> {status ? "TRUE" : "FALSE"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
