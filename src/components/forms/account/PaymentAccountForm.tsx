"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Loader2,
  Banknote,
  KeyRound,
  FileBadge2,
  AlertTriangle,
  ClipboardCheck,
  Building,
} from "lucide-react";

import {
  BankAccount,
  BankAccountService,
} from "@/services/domains/bankAccountService";
import {
  pixKeySchema,
  PixKeyFormValues,
} from "@/validations/bankAccounts/pixKeyValidation";
import { CustomInput } from "@/components/forms/CustomInput";
import { CustomButton } from "@/components/forms/CustomButton";
import { CustomDropdownInput } from "@/components/forms/CustomDropdownInput";
import { StatusBadge } from "@/components/common/StatusBadge";
import { extractAxiosError } from "@/services/api";
import { pixKeyTypes } from "@/constants/pixKeyTypes";

// Componente para exibir a conta já existente
const ViewBankAccount = ({ account }: { account: BankAccount }) => {
  const status = account.subAccount?.statusGeneral;
  const onboardingUrl = account.subAccount?.onboardingUrl;

  const getStatusInfo = () => {
    switch (status) {
      case "APPROVED":
        return {
          icon: <ClipboardCheck className="text-green-600" size={32} />,
          title: "Conta Verificada!",
          description:
            "Sua conta de pagamentos está aprovada e pronta para receber transferências.",
          badge: <StatusBadge isActive={true} activeText="Aprovada" />,
        };
      case "REJECTED":
        return {
          icon: <AlertTriangle className="text-red-600" size={32} />,
          title: "Pendência nos Documentos",
          description:
            "Ocorreu um problema na verificação dos seus documentos. Por favor, acesse o link de onboarding para corrigir as pendências.",
          badge: <StatusBadge isActive={false} inactiveText="Rejeitada" />,
        };
      default: // PENDING
        return {
          icon: <FileBadge2 className="text-yellow-600" size={32} />,
          title: "Verificação Pendente",
          description:
            "Sua conta foi criada e está aguardando a verificação de documentos. Acesse o link de onboarding que enviamos para o seu e-mail para concluir.",
          badge: <StatusBadge isActive={false} inactiveText="Pendente" />,
        };
    }
  };

  const { icon, title, description, badge } = getStatusInfo();

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <p className="text-gray-600 mt-2 max-w-md mx-auto">{description}</p>
        {onboardingUrl && status !== "APPROVED" && (
          <CustomButton
            onClick={() => window.open(onboardingUrl, "_blank")}
            className="mt-4"
          >
            Acessar Onboarding de Documentos
          </CustomButton>
        )}
      </div>

      <div className="border rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Sua Chave PIX</h3>
          {badge}
        </div>
        <dl className="space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <dt className="text-gray-500">Tipo da Chave:</dt>
            <dd className="font-medium">{account.pixAddressKeyType}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Chave PIX:</dt>
            <dd className="font-mono">{account.pixAddressKey}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

// Componente do formulário para criar a conta
const CreateBankAccountForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PixKeyFormValues>({
    resolver: zodResolver(pixKeySchema),
  });

  const pixKeyType = watch("pixAddressKeyType");

  const onSubmit = async (data: PixKeyFormValues) => {
    setLoading(true);
    try {
      await BankAccountService.create(data);
      toast.success("Conta de pagamentos criada com sucesso!", {
        description:
          "Enviamos um e-mail com os próximos passos para a verificação de documentos.",
      });
      onSuccess();
    } catch (error) {
      toast.error("Falha ao criar conta", {
        description: extractAxiosError(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 ">
      <div className="text-center">
        <Building size={40} className="mx-auto text-primary" />
        <h2 className="text-2xl font-bold text-gray-800 mt-2">
          Cadastre sua Conta de Pagamentos
        </h2>
        <p className="text-gray-500 mt-1">
          Para receber os aluguéis, você precisa cadastrar uma chave PIX. Isso
          criará sua subconta de pagamentos automaticamente.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <CustomDropdownInput
          label="Tipo de Chave PIX"
          placeholder="Selecione o tipo da chave"
          options={pixKeyTypes}
          selectedOptionValue={pixKeyType}
          onOptionSelected={(value) =>
            setValue(
              "pixAddressKeyType",
              value as PixKeyFormValues["pixAddressKeyType"],
              { shouldValidate: true }
            )
          }
          error={errors.pixAddressKeyType?.message}
        />
        <Controller
          name="pixAddressKey"
          control={control}
          render={({ field }) => (
            <CustomInput
              id="pixAddressKey"
              label="Chave PIX"
              icon={<KeyRound />}
              placeholder="Digite sua chave PIX"
              error={errors.pixAddressKey?.message}
              {...field}
            />
          )}
        />
        <div className="pt-2">
          <CustomButton
            type="submit"
            disabled={loading}
            className="w-full"
            fontSize="text-lg"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Salvar e Criar Conta"
            )}
          </CustomButton>
        </div>
      </form>
    </div>
  );
};

export function PaymentAccountForm() {
  const [account, setAccount] = useState<BankAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await BankAccountService.findMyAccount();
      setAccount(response.data);
    } catch (error) {
      // Se der 404, significa que não tem conta, o que é normal.
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

  return (
    <div className="bg-white p-6 rounded-b-xl rounded-tr-xl">
      {account ? (
        <ViewBankAccount account={account} />
      ) : (
        <CreateBankAccountForm onSuccess={fetchData} />
      )}
    </div>
  );
}
