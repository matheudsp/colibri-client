"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Loader2,
  KeyRound,
  FileBadge2,
  AlertTriangle,
  Building,
  Edit,
  Wallet,
  HelpCircle,
  UserRoundCheck,
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
import { extractAxiosError } from "@/services/api";
import { pixKeyTypes } from "@/constants/pixKeyTypes";
import { Tooltip } from "@/components/common/Tooltip";

// --- [NOVO] Componente de Visualização da Conta (Totalmente Refatorado) ---
const ViewBankAccount = ({
  account,
  onEdit,
}: {
  account: BankAccount;
  onEdit: () => void;
}) => {
  const status = account.subAccount?.statusGeneral;
  const onboardingUrl = account.subAccount?.onboardingUrl;
  const balance = account.balance?.balance ?? 0;

  const getStatusInfo = () => {
    switch (status) {
      case "APPROVED":
        return {
          icon: <UserRoundCheck className="text-green-600" size={24} />,
          title: "Conta Verificada",
          description:
            "Sua conta está aprovada e pronta para receber transferências.",
        };
      case "REJECTED":
        return {
          icon: <AlertTriangle className="text-red-600" size={24} />,
          title: "Pendência na Verificação",
          description:
            "Houve um problema com seus documentos. Por favor, corrija as pendências.",
        };
      default: // PENDING
        return {
          icon: <FileBadge2 className="text-yellow-600" size={24} />,
          title: "Verificação Pendente",
          description:
            "Sua conta aguarda verificação de documentos. Acesse o onboarding para concluir.",
        };
    }
  };

  const { icon, title, description } = getStatusInfo();

  return (
    <div className="rounded-xl  overflow-hidden">
      {/* Seção Superior: Saldo e Status */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Lado Esquerdo: Saldo */}
        <div className="p-6 flex flex-col justify-center items-center text-center">
          <Wallet className="text-primary mb-2" size={32} />
          <h3 className="text-sm font-semibold text-gray-500">
            SALDO DISPONÍVEL
          </h3>
          <p className="text-4xl font-bold text-green-600 mt-1">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(balance)}
          </p>
        </div>

        {/* Lado Direito: Status */}
        <div className="p-6 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col justify-center text-center">
          <div className="w-12 h-12 mx-auto  rounded-full flex items-center justify-center shadow-sm mb-3">
            {icon}
          </div>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
          {onboardingUrl && status !== "APPROVED" && (
            <CustomButton
              onClick={() => window.open(onboardingUrl, "_blank")}
              className="mt-3"
            >
              Resolver Pendências
            </CustomButton>
          )}
        </div>
      </div>

      {/* Seção Inferior: Chave PIX */}
      <div className="border-t border-gray-200 py-6 md:py-6 md:px-6">
        <div className="flex md:flex-row flex-col gap-2 justify-between items-center mb-4">
          <div className="flex  items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Chave PIX para Recebimentos
            </h3>
            <Tooltip
              content={
                "Tenha cuidado ao cadastrar ou alterar sua chave PIX, ela será o destino final para repasses automáticos ao receber pagamentos. Portanto, ceritifique-se de que a chave está correta e ativa."
              }
              position="top"
            >
              <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
            </Tooltip>
          </div>
          <CustomButton onClick={onEdit} ghost>
            <Edit size={16} className="mr-2" /> Alterar
          </CustomButton>
        </div>
        <dl className="space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <dt className="text-gray-500">Tipo da Chave:</dt>
            <dd className="font-medium">
              {account.bankAccount?.pixAddressKeyType || "N/A"}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Chave:</dt>
            <dd className="font-mono">
              {account.bankAccount?.pixAddressKey || "N/A"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

// --- Formulário Unificado (sem alterações na lógica) ---
const BankAccountForm = ({
  onSuccess,
  onCancel,
  initialData,
}: {
  onSuccess: () => void;
  onCancel?: () => void;
  initialData?: BankAccount;
}) => {
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData;

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PixKeyFormValues>({
    resolver: zodResolver(pixKeySchema),
    defaultValues: {
      pixAddressKeyType: initialData?.bankAccount?.pixAddressKeyType || "CPF",
      pixAddressKey: initialData?.bankAccount?.pixAddressKey || "",
    },
  });

  const pixKeyType = watch("pixAddressKeyType");

  const onSubmit = async (data: PixKeyFormValues) => {
    setLoading(true);
    try {
      if (isEditing) {
        await BankAccountService.update(data);
        toast.success("Chave PIX atualizada com sucesso!");
      } else {
        await BankAccountService.create(data);
        toast.success("Conta de pagamentos criada com sucesso!", {
          description:
            "Enviamos um e-mail com os próximos passos para a verificação de documentos.",
        });
      }
      onSuccess();
    } catch (error) {
      toast.error(
        isEditing ? "Falha ao atualizar a chave" : "Falha ao criar conta",
        {
          description: extractAxiosError(error),
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <Building size={40} className="mx-auto text-primary" />
        <h2 className="text-2xl font-bold text-gray-800 mt-2">
          {isEditing ? "Alterar Chave PIX" : "Cadastre sua Conta de Pagamentos"}
        </h2>
        <p className="text-gray-500 mt-1 max-w-md mx-auto">
          {isEditing
            ? "Insira a nova chave PIX para onde os repasses serão enviados."
            : "Para receber, cadastre uma chave PIX. Isso criará sua subconta de pagamentos automaticamente."}
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
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          {isEditing && (
            <CustomButton
              type="button"
              onClick={onCancel}
              disabled={loading}
              ghost
              className="w-full"
            >
              Cancelar
            </CustomButton>
          )}
          <CustomButton
            type="submit"
            disabled={loading}
            className="w-full"
            fontSize="text-lg"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Salvar Chave PIX"
            )}
          </CustomButton>
        </div>
      </form>
    </div>
  );
};

// --- Componente Principal (sem alterações na lógica) ---
export function PaymentAccountForm() {
  const [account, setAccount] = useState<BankAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setIsEditing(false); // Sempre volta para o modo de visualização ao recarregar
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

  return (
    <div className=" p-0 md:p-4 rounded-b-xl rounded-tr-xl">
      {account ? (
        isEditing ? (
          <BankAccountForm
            onSuccess={fetchData}
            onCancel={() => setIsEditing(false)}
            initialData={account}
          />
        ) : (
          <ViewBankAccount
            account={account}
            onEdit={() => setIsEditing(true)}
          />
        )
      ) : (
        <BankAccountForm onSuccess={fetchData} />
      )}
    </div>
  );
}
