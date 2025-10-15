"use client";

import { MessageCircle, HelpCircle } from "lucide-react";
import { BankAccount } from "@/services/domains/bankAccountService";
import { CustomButton } from "../../forms/CustomButton";

const ACCOUNT_MANAGER_WHATSAPP =
  process.env.NEXT_PUBLIC_ACCOUNT_MANAGER_WHATSAPP;

interface BankAccountAwaitingApprovalProps {
  account: BankAccount;
}

export function BankAccountAwaitingApproval({
  account,
}: BankAccountAwaitingApprovalProps) {
  const userEmail = account.user?.email || "E-mail não informado";

  const whatsappMessage = encodeURIComponent(
    `Olá! Gostaria de solicitar a aprovação da minha conta de pagamentos na plataforma Locaterra. Meu e-mail de cadastro é: ${userEmail}`
  );

  const whatsappUrl = `https://wa.me/${ACCOUNT_MANAGER_WHATSAPP}?text=${whatsappMessage}`;

  return (
    <div className="overflow-hidden">
      <div className="flex flex-col items-center space-y-4 max-w-xl mx-auto">
        <div className="w-16 h-16 bg-primary-light/75 mx-auto rounded-full flex items-center justify-center shadow-sm mb-4">
          <MessageCircle
            className="text-primary-hover animate-wiggle"
            size={32}
          />
        </div>
        <h3 className="text-xl font-bold text-gray-800">
          Solicitação em Análise
        </h3>
        <p className="text-sm text-gray-600  ">
          Sua solicitação para criar uma conta de recebimentos foi enviada e
          está aguardando a aprovação de um de nossos gerentes.
        </p>
        <p className="text-sm text-gray-600 ">
          Para acelerar o processo, você pode entrar em contato diretamente
          conosco clicando no botão abaixo.
        </p>

        <div className="mt-6 w-full ">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline"
          >
            <CustomButton
              icon={<MessageCircle size={18} />}
              className="w-full bg-secondary hover:bg-secondary-hover transition-colors"
            >
              Contatar Gerente de Contas
            </CustomButton>
          </a>
        </div>

        <div className="text-xs text-gray-500 flex items-center">
          <HelpCircle size={14} className="mr-1.5" />
          <span>
            Ao contatar, solicitaremos apenas seu e-mail e documento de
            identificação.
          </span>
        </div>
      </div>
    </div>
  );
}
