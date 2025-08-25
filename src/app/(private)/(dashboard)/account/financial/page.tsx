"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  // Landmark,
  // Building,
  // User,
  Loader2,
  AlertCircle,
  PiggyBank,
  Wallet,
  Edit,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Roles } from "@/constants";

import {
  BankAccountService,
  Balance,
  BankAccount,
} from "@/services/domains/bankAccountService";
import {
  bankAccountSchema,
  CreateBankAccountFormValues,
} from "@/validations/bankAccounts/bankAccountCreateValidation";
// import { CustomFormInput } from "@/components/forms/CustomFormInput";
import { CustomButton } from "@/components/forms/CustomButton";
import { CustomRadioGroup } from "@/components/forms/CustomRadioGroup";
import { useRouter } from "next/navigation";
import { extractAxiosError } from "@/services/api";

const ViewBankAccount = ({
  account,
  balance,
  onEdit,
}: {
  account: BankAccount;
  balance: Balance;
  onEdit: () => void;
}) => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-xl shadow-md border text-center">
      <Wallet size={48} className="mx-auto text-primary" />
      <h2 className="text-2xl font-bold text-gray-800 mt-4">
        Saldo Disponível
      </h2>
      <p className="text-4xl font-bold text-green-600 mt-2">
        {new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(balance.balance || 0)}
      </p>
      <p className="text-sm text-gray-500 mt-2">
        Este é o saldo atual na sua conta.
      </p>
    </div>
    <div className="bg-white p-6 rounded-xl shadow-md border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Sua Conta Bancária</h3>
        <CustomButton onClick={onEdit} ghost>
          <Edit size={16} className="mr-2" /> Editar
        </CustomButton>
      </div>
      <div className="space-y-3 text-gray-600">
        <p>
          <strong>Banco:</strong> {account.bank}
        </p>
        <p>
          <strong>Agência:</strong> {account.agency}
        </p>
        <p>
          <strong>Conta:</strong> {account.account}
        </p>
        <p>
          <strong>Tipo:</strong>{" "}
          {account.accountType === "CONTA_CORRENTE"
            ? "Conta Corrente"
            : "Conta Poupança"}
        </p>
      </div>
    </div>
  </div>
);

const BankAccountForm = ({
  initialData,
  onSuccess,
  onCancel,
}: {
  initialData?: BankAccount;
  onSuccess: () => void;
  onCancel?: () => void;
}) => {
  const isEditing = !!initialData;
  const [loading, setLoading] = useState(false);
  const {
    // control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateBankAccountFormValues>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      bank: initialData?.bank || "",
      agency: initialData?.agency || "",
      account: initialData?.account || "",
      accountType: initialData?.accountType || "CONTA_CORRENTE",
    },
  });

  const accountType = watch("accountType");

  const onSubmit = async (data: CreateBankAccountFormValues) => {
    setLoading(true);
    try {
      if (isEditing) {
        await BankAccountService.update(data);
        toast.success("Conta bancária atualizada com sucesso!");
      } else {
        await BankAccountService.create(data);
        toast.success("Conta bancária cadastrada com sucesso!");
      }
      onSuccess();
    } catch (error) {
      const errorMessage = extractAxiosError(error);
      toast.error("Operação falhou", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border">
      <div className="text-center">
        <PiggyBank size={40} className="mx-auto text-primary" />
        <h2 className="text-2xl font-bold text-gray-800 mt-2">
          {isEditing ? "Editar Conta Bancária" : "Cadastre sua Conta Bancária"}
        </h2>
        <p className="text-gray-500 mt-1">
          {isEditing
            ? "Atualize seus dados bancários."
            : "Precisamos dos seus dados para realizar as transferências."}
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        {/* <CustomFormInput
          id="bank"
          icon={<Landmark />}
          label="Código do Banco (Ex: 001)"
          {...register("bank")}
          error={errors.bank?.message}
        />
        <CustomFormInput
          id="agency"
          icon={<Building />}
          label="Agência (sem dígito)"
          {...register("agency")}
          error={errors.agency?.message}
        />
        <CustomFormInput
          id="account"
          icon={<User />}
          label="Conta (com dígito)"
          {...register("account")}
          error={errors.account?.message}
        /> */}
        <CustomRadioGroup
          name="accountType"
          options={[
            { id: "1", value: "CONTA_CORRENTE", label: "Conta Corrente" },
            { id: "2", value: "CONTA_POUPANCA", label: "Conta Poupança" },
          ]}
          selectedValue={accountType}
          onChange={(value) =>
            setValue(
              "accountType",
              value as "CONTA_CORRENTE" | "CONTA_POUPANCA",
              {
                shouldValidate: true,
              }
            )
          }
          error={errors.accountType?.message}
        />
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
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
              "Salvar Informações"
            )}
          </CustomButton>
        </div>
      </form>
    </div>
  );
};

export default function FinancialPage() {
  useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const router = useRouter();

  const [account, setAccount] = useState<BankAccount | null>(null);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    setIsEditing(false);
    try {
      const accountRes = await BankAccountService.findMyAccount();
      setAccount(accountRes.data);

      const balanceRes = await BankAccountService.getBalance();
      setBalance(balanceRes.data);
    } catch (error) {
      if (error instanceof Error && error.message.includes("404")) {
        setAccount(null);
        setBalance(null);
      } else {
        toast.error(`Erro ao carregar dados: ${(error as Error).message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!roleLoading) {
      if (role !== Roles.LOCADOR) {
        toast.error("Acesso negado.");
        router.push("/properties");
      } else {
        fetchData();
      }
    }
  }, [role, roleLoading, router]);

  const renderContent = () => {
    if (loading || roleLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      );
    }

    if (account) {
      if (isEditing) {
        return (
          <BankAccountForm
            initialData={account}
            onSuccess={fetchData}
            onCancel={() => setIsEditing(false)}
          />
        );
      }
      if (balance) {
        return (
          <ViewBankAccount
            account={account}
            balance={balance}
            onEdit={() => setIsEditing(true)}
          />
        );
      }
    }

    if (!account && !loading) {
      return <BankAccountForm onSuccess={fetchData} />;
    }

    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3">
        <AlertCircle />
        <p>Não foi possível carregar suas informações financeiras.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-28 pb-10">
      <CustomButton
        onClick={() => router.push("/account")}
        ghost
        className="text-gray-600 hover:text-gray-900 mb-6 ml-4"
      >
        <ArrowLeft className="mr-2" />
        Voltar para Conta
      </CustomButton>
      <div className="max-w-2xl mx-auto px-4">{renderContent()}</div>
    </div>
  );
}
