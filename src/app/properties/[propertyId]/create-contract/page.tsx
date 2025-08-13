"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  createContractSchema,
  CreateContractFormValues,
} from "@/validations/contracts/contractCreateValidation";
import { ContractService } from "@/services/domains/contractService";
import { UserService } from "@/services/domains/userService";
import { userProps } from "@/interfaces/user";
import {
  Mail,
  Search,
  User as UserIcon,
  FileText,
  Lock,
  Calendar,
  Clock,
  DollarSign,
  Shield,
  Loader2,
  Building,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import { CustomFormInput } from "@/components/forms/CustomFormInput";
import { CustomButton } from "@/components/forms/CustomButton";
import { CustomDropdownInput } from "@/components/forms/CustomDropdownInput";

import { Stepper } from "@/components/layout/Stepper";
import { guaranteeTypes } from "@/constants";
import { unmaskCurrency } from "@/utils/masks/maskCurrency";
import { toISODate } from "@/utils/formatters/formatDate";
import { unmaskNumeric } from "@/utils/masks/maskNumeric";

export default function CreateContractPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.propertyId as string;

  const [currentStep, setCurrentStep] = useState(1);
  const [tenantAction, setTenantAction] = useState<"search" | "create">(
    "search"
  );
  const [loading, setLoading] = useState(false);
  const [searchingTenant, setSearchingTenant] = useState(false);
  const [foundTenants, setFoundTenants] = useState<userProps[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<userProps | null>(null);
  const [emailToSearch, setEmailToSearch] = useState("");

  const steps = [
    "Encontrar Inquilino",
    "Detalhes do Contrato",
    "Contrato Criado",
  ];

  const {
    register,
    handleSubmit,
    setValue,
    resetField,
    watch,
    trigger,
    formState: { errors },
  } = useForm<CreateContractFormValues>({
    resolver: zodResolver(createContractSchema),
    defaultValues: {
      propertyId,
    },
  });

  const handleActionChange = (action: "search" | "create") => {
    setTenantAction(action);
    setFoundTenants([]);
    setSelectedTenant(null);
    setEmailToSearch("");
    resetField("tenantEmail");
    resetField("tenantName");
    resetField("tenantCpfCnpj");
    resetField("tenantPassword");
  };

  const guaranteeTypeValue = watch("guaranteeType");

  const handleSearchTenant = async () => {
    if (!emailToSearch) {
      toast.error("Por favor, insira um e-mail para buscar.");
      return;
    }
    setSearchingTenant(true);
    try {
      const response: any = await UserService.search({ email: emailToSearch });
      const userList = response.data || [];

      if (userList.length > 0) {
        setFoundTenants(userList);
        toast.success(`${userList.length} inquilino(s) encontrado(s).`);
      } else {
        toast.info(
          "Nenhum inquilino encontrado. Verifique o e-mail ou cadastre um novo."
        );
        setFoundTenants([]);
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao buscar o inquilino.");
    } finally {
      setSearchingTenant(false);
    }
  };

  const handleSelectTenant = (tenant: userProps) => {
    setSelectedTenant(tenant);
    setValue("tenantEmail", tenant.email, { shouldValidate: true });
    setFoundTenants([]);
  };

  const nextStep = async () => {
    const fieldsToValidate: (keyof CreateContractFormValues)[] =
      currentStep === 1
        ? tenantAction === "create"
          ? ["tenantEmail", "tenantName", "tenantCpfCnpj", "tenantPassword"]
          : ["tenantEmail"]
        : [
            "rentAmount",
            "startDate",
            "durationInMonths",
            "guaranteeType",
            "securityDeposit",
            "condoFee",
            "iptuFee",
          ];

    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      if (currentStep === 1 && tenantAction === "search" && !selectedTenant) {
        toast.error("Por favor, busque e selecione um inquilino existente.");
        return;
      }
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = async (data: CreateContractFormValues) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        durationInMonths: data.durationInMonths,
        guaranteeType: data.guaranteeType,
        propertyId: data.propertyId,
        rentAmount: unmaskNumeric(data.rentAmount),
        iptuFee: data.iptuFee ? unmaskNumeric(data.iptuFee) : undefined,
        securityDeposit: data.securityDeposit
          ? unmaskNumeric(data.securityDeposit)
          : undefined,
        condoFee: data.condoFee ? unmaskNumeric(data.condoFee) : undefined,
        startDate: toISODate(data.startDate),
        tenantEmail: data.tenantEmail,
      };
      // console.log("PAYLOAD DE CRIACAO DE CONTRATO: ", payload);
      await ContractService.create(payload);
      setCurrentStep(3);
    } catch (error) {
      console.error("Erro ao criar contrato:", error);
      // toast.error(
      //   "Não foi possível criar o contrato. Verifique os dados e tente novamente."
      // );
      toast.error(`${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-svh w-full flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white grid place-items-center shadow-lg p-8 rounded-xl w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Criar Novo Contrato de Locação
        </h1>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Siga as etapas para gerar um novo contrato.
        </p>

        <Stepper steps={steps} currentStep={currentStep} />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full mt-8 space-y-6"
        >
          {currentStep === 1 && (
            <fieldset className="border p-4 rounded-lg space-y-4">
              <legend className="px-2 font-bold text-lg text-gray-700">
                1. Dados do Inquilino
              </legend>

              <p className="text-sm text-gray-600">
                Para evitar duplicidade, primeiro busque pelo e-mail do
                inquilino. Se ele não for encontrado, utilize a aba "Cadastrar
                Novo".
              </p>

              <div className="flex w-full bg-gray-100 border border-gray-200 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => handleActionChange("search")}
                  className={`w-1/2 py-2 rounded-md transition-all duration-200 text-sm font-bold ${
                    tenantAction === "search"
                      ? "bg-primary text-white shadow"
                      : "bg-transparent text-gray-600"
                  }`}
                >
                  Buscar Existente
                </button>
                <button
                  type="button"
                  onClick={() => handleActionChange("create")}
                  className={`w-1/2 py-2 rounded-md transition-all duration-200 text-sm font-bold ${
                    tenantAction === "create"
                      ? "bg-primary text-white shadow"
                      : "bg-transparent text-gray-600"
                  }`}
                >
                  Cadastrar Novo
                </button>
              </div>

              {tenantAction === "search" && (
                <div className="pt-2 space-y-4">
                  <p className="text-xs text-gray-500 italic">
                    Digite o e-mail do inquilino e clique em "Buscar" para
                    encontrar um usuário já cadastrado.
                  </p>
                  <div className="flex items-center gap-2">
                    <CustomFormInput
                      id="search-email"
                      icon={<Mail />}
                      label="E-mail do inquilino"
                      value={emailToSearch}
                      onChange={(e) => setEmailToSearch(e.target.value)}
                      disabled={searchingTenant}
                    />
                    <CustomButton
                      onClick={handleSearchTenant}
                      disabled={searchingTenant}
                      className="h-full"
                    >
                      {searchingTenant ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Search />
                      )}{" "}
                      Buscar
                    </CustomButton>
                  </div>
                  {foundTenants.length > 0 && (
                    <div className="w-full space-y-2 border-t pt-4">
                      {foundTenants.map((user) => (
                        <div
                          key={user.id}
                          className="w-full p-3 bg-gray-50 rounded-lg flex items-center justify-between"
                        >
                          <div>
                            <p className="font-semibold text-gray-800">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {user.email}
                            </p>
                          </div>
                          <CustomButton
                            onClick={() => handleSelectTenant(user)}
                            color="bg-green-600"
                            textColor="text-white"
                          >
                            <CheckCircle size={16} /> Selecionar
                          </CustomButton>
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedTenant && (
                    <div
                      className="w-full p-4 bg-primary/10 border-2 border-primary/20 rounded-lg"
                      role="group"
                      aria-label="Inquilino Selecionado"
                    >
                      <p className="text-sm font-semibold text-primary mb-2">
                        Inquilino Selecionado:
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <UserIcon className="w-8 h-8 text-primary" />
                        </div>
                        <div className="flex-grow">
                          <p className="font-bold text-lg text-gray-800">
                            {selectedTenant.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedTenant.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {tenantAction === "create" && (
                <div className="space-y-4 pt-2">
                  <p className="text-xs text-gray-500 italic">
                    Preencha os dados abaixo para criar um novo cadastro para o
                    inquilino.
                  </p>
                  <CustomFormInput
                    id="tenantEmail"
                    label="E-mail*"
                    icon={<Mail />}
                    {...register("tenantEmail")}
                    error={errors.tenantEmail?.message}
                  />
                  <CustomFormInput
                    id="tenantName"
                    label="Nome Completo*"
                    icon={<UserIcon />}
                    {...register("tenantName")}
                    error={errors.tenantName?.message}
                  />
                  <CustomFormInput
                    id="tenantCpfCnpj"
                    label="CPF/CNPJ*"
                    icon={<FileText />}
                    {...register("tenantCpfCnpj")}
                    error={errors.tenantCpfCnpj?.message}
                  />
                  <CustomFormInput
                    id="tenantPassword"
                    label="Senha"
                    icon={<Lock />}
                    {...register("tenantPassword")}
                    error={errors.tenantPassword?.message}
                  />
                </div>
              )}
            </fieldset>
          )}

          {currentStep === 2 && (
            <fieldset className="border p-4 rounded-lg">
              <legend className="px-2 font-bold text-lg text-gray-700">
                2. Detalhes do Contrato
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 pt-2">
                <CustomFormInput
                  id="rentAmount"
                  icon={<DollarSign />}
                  label="Valor do Aluguel*"
                  {...register("rentAmount")}
                  registration={register("rentAmount")}
                  error={errors.rentAmount?.message}
                  mask="numeric"
                />

                <div>
                  <CustomFormInput
                    id="condoFee"
                    icon={<DollarSign />}
                    label="Taxa de Condomínio"
                    {...register("condoFee")}
                    error={errors.condoFee?.message}
                    mask="numeric"
                  />
                  <p className="text-xs text-gray-500 mt-1 pl-1">
                    (Opcional) Taxa mensal do condomínio.
                  </p>
                </div>
                <div>
                  <CustomFormInput
                    id="iptuFee"
                    label="IPTU (mensal)"
                    icon={<Building />}
                    {...register("iptuFee")}
                    error={errors.iptuFee?.message}
                    mask="numeric"
                  />
                  <p className="text-xs text-gray-500 mt-1 pl-1">
                    (Opcional) Valor mensal do IPTU.
                  </p>
                </div>

                <div className="md:col-span-2">
                  <CustomDropdownInput
                    placeholder="Tipo de Garantia*"
                    options={guaranteeTypes}
                    selectedOptionValue={guaranteeTypeValue}
                    onOptionSelected={(val) =>
                      val &&
                      setValue("guaranteeType", val, { shouldValidate: true })
                    }
                    error={errors.guaranteeType?.message}
                  />
                </div>

                {guaranteeTypeValue === "DEPOSITO_CAUCAO" && (
                  <div>
                    <CustomFormInput
                      id="securityDeposit"
                      label="Depósito Caução"
                      icon={<DollarSign />}
                      mask="numeric"
                      {...register("securityDeposit")}
                      error={errors.securityDeposit?.message}
                    />
                    <p className="text-xs text-gray-500 mt-1 pl-1">
                      Valor que fica retido como garantia.
                    </p>
                  </div>
                )}

                <CustomFormInput
                  id="startDate"
                  label="Data de Início*"
                  icon={<Calendar />}
                  mask="date"
                  {...register("startDate")}
                  error={errors.startDate?.message}
                />
                <CustomFormInput
                  id="durationInMonths"
                  label="Duração (meses)*"
                  icon={<Clock />}
                  type="number"
                  {...register("durationInMonths")}
                  error={errors.durationInMonths?.message}
                />
              </div>
            </fieldset>
          )}

          {currentStep === 3 && (
            <div className="text-center space-y-4 p-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold text-gray-800">
                Contrato Criado com Sucesso!
              </h2>
              <p className="text-gray-600">
                O inquilino receberá as instruções por e-mail para dar
                continuidade ao processo de locação.
              </p>
              <CustomButton
                onClick={() => router.push(`/properties`)}
                fontSize="text-lg"
                className="mt-4"
              >
                Voltar ao menu
              </CustomButton>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {currentStep > 1 && currentStep < 3 && (
              <CustomButton onClick={prevStep} disabled={loading}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </CustomButton>
            )}
            <div />
            {currentStep < 2 && (
              <CustomButton onClick={nextStep} disabled={loading}>
                Próximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </CustomButton>
            )}
            {currentStep === 2 && (
              <CustomButton type="submit" disabled={loading} fontSize="text-lg">
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Gerar Contrato"
                )}
              </CustomButton>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
