"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as htmlToImage from "html-to-image";
import {
  Save,
  Share2,
  Copy,
  User,
  KeyRound,
  Globe,
  CalendarIcon,
  FilePen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Controller, useForm } from "react-hook-form";
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
  Clock,
  DollarSign,
  Loader2,
  Building,
  PhoneIncoming,
} from "lucide-react";

import { CustomFormInput } from "@/components/forms/CustomFormInput";
import { CustomButton } from "@/components/forms/CustomButton";
import { CustomDropdownInput } from "@/components/forms/CustomDropdownInput";

import { Stepper } from "@/components/layout/Stepper";
import { guaranteeTypes } from "@/constants";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toISODate } from "@/utils/formatters/formatDate";
import { unmaskNumeric } from "@/utils/masks/maskNumeric";
import type { ApiResponse } from "@/types/api";
import { cpfCnpjMask } from "@/utils/masks/cpfCnpjMask";
import { extractAxiosError } from "@/services/api";
import { LottieAnimation } from "@/components/common/LottieAnimation";
import successAnimation from "../../../../../../public/lottie/success-animation.json";

export default function CreateContractPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const propertyId = params.propertyId as string;
  const [canShare, setCanShare] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [tenantAction, setTenantAction] = useState<"search" | "create">(
    "search"
  );
  const [loading, setLoading] = useState(false);
  const [searchingTenant, setSearchingTenant] = useState(false);
  const [foundTenants, setFoundTenants] = useState<userProps[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<userProps | null>(null);
  const [newTenantCredentials, setNewTenantCredentials] = useState<{
    email: string;
    password?: string;
  } | null>(null);
  const [isEasyContractFlow, setIsEasyContractFlow] = useState(false);
  const credentialsCardRef = useRef<HTMLDivElement>(null);
  const steps = [
    "Encontrar inquilino",
    "Informações do contrato",
    "Contrato criado",
  ];

  useEffect(() => {
    if (navigator && "share" in navigator) {
      setCanShare(true);
    }
  }, []);

  const {
    control,
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
      tenantAction: "search",
    },
    context: { tenantAction },
  });

  const handleActionChange = (action: "search" | "create") => {
    setTenantAction(action);
    setValue("tenantAction", action, { shouldValidate: true });

    setFoundTenants([]);
    setSelectedTenant(null);
    resetField("tenantEmail");
    resetField("tenantName");
    resetField("tenantCpfCnpj");
    resetField("tenantPassword");
    resetField("tenantPhone");
  };

  const cpfCnpjValue = watch("tenantCpfCnpj");
  const guaranteeTypeValue = watch("guaranteeType");

  const handleSearchTenant = async () => {
    if (!cpfCnpjValue || cpfCnpjValue.length < 11) {
      toast.error("Por favor, insira um CPF/CNPJ válido para buscar.");
      return;
    }

    setSearchingTenant(true);
    setFoundTenants([]);

    try {
      const response: ApiResponse<userProps[]> = await UserService.search({
        cpfCnpj: cpfCnpjValue,
        role: "LOCATARIO",
      });
      const userList = response.data || [];
      if (userList.length > 0) {
        setFoundTenants(userList);
        toast.success(`${userList.length} inquilino(s) encontrado(s).`);
      } else {
        toast.info(
          "Nenhum inquilino encontrado. Verifique o CPF/CNPJ ou cadastre um novo."
        );
        setFoundTenants([]);
      }
    } catch (_error) {
      const errorMessage = extractAxiosError(_error);
      toast.error("Ocorreu um erro ao buscar inquilino", {
        description: errorMessage,
      });
    } finally {
      setSearchingTenant(false);
    }
  };
  const handleSelectTenant = useCallback(
    (tenant: userProps) => {
      setSelectedTenant(tenant);
      setValue("tenantCpfCnpj", tenant.cpfCnpj!, { shouldValidate: true });
      setFoundTenants([]);
    },
    [setValue]
  );
  const nextStep = async () => {
    const fieldsToValidate: (keyof CreateContractFormValues)[] =
      tenantAction === "create"
        ? [
            "tenantName",
            "tenantCpfCnpj",
            "tenantEmail",
            "tenantPhone",
            "tenantPassword",
          ]
        : ["tenantCpfCnpj"];

    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      if (currentStep === 1 && tenantAction === "search" && !selectedTenant) {
        toast.error(
          "Por favor, busque e selecione um inquilino para continuar."
        );
        return;
      }
      setCurrentStep((prev) => prev + 1);
    } else {
      toast.error(
        "Por favor, corrija os erros no formulário antes de continuar."
      );
    }
  };
  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = async (data: CreateContractFormValues) => {
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = {
        ...data,

        rentAmount: unmaskNumeric(data.rentAmount),
        iptuFee: data.iptuFee ? unmaskNumeric(data.iptuFee) : undefined,
        securityDeposit: data.securityDeposit
          ? unmaskNumeric(data.securityDeposit)
          : undefined,
        condoFee: data.condoFee ? unmaskNumeric(data.condoFee) : undefined,
        startDate: toISODate(data.startDate),
      };
      if (tenantAction === "search" && selectedTenant) {
        delete payload.tenantEmail;
        delete payload.tenantPhone;
        delete payload.tenantName;
        delete payload.tenantPassword;
      }
      delete payload.tenantAction;
      // console.log(payload);
      const response = await ContractService.create(payload);

      if (data.tenantAction === "create") {
        setNewTenantCredentials({
          email: response.data.tenant.email,
          password: data.tenantPassword,
        });
      }

      setCurrentStep(3);
    } catch (_error) {
      const errorMessage = extractAxiosError(_error);
      toast.error("Erro ao criar contrato", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSaveCredentials = () => {
    if (credentialsCardRef.current === null) {
      toast.error("Não foi possível encontrar o card de credenciais.");
      return;
    }

    toast.promise(
      htmlToImage
        .toPng(credentialsCardRef.current, { cacheBust: true })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = `acesso-${newTenantCredentials?.email}.png`;
          link.href = dataUrl;
          link.click();
        }),
      {
        loading: "Salvando imagem...",
        success: "Imagem salva com sucesso!",
        error: "Falha ao salvar a imagem.",
      }
    );
  };
  const handleShareCredentials = async () => {
    if (newTenantCredentials) {
      const shareText = `Olá! Aqui estão seus dados de acesso ao Portal do Inquilino:\n\nLogin (E-mail): ${newTenantCredentials.email}\nSenha: ${newTenantCredentials.password}\n\nAcesse em: https://www.locaterra.com.br`;

      if (navigator.share) {
        try {
          await navigator.share({
            title: "Acesso ao Portal do Inquilino",
            text: shareText,
          });
        } catch (error) {
          console.error("Erro ao compartilhar:", error);
          toast.error("O compartilhamento foi cancelado ou falhou.");
        }
      } else {
        navigator.clipboard.writeText(shareText);
        toast.success("Dados de acesso copiados para a área de transferência!");
      }
    }
  };
  useEffect(() => {
    const tenantCpfCnpj = searchParams.get("tenantCpfCnpj");

    const startEasyFlow = async () => {
      if (tenantCpfCnpj && !selectedTenant) {
        // Executa apenas se tiver CPF e nenhum inquilino foi selecionado ainda
        setIsEasyContractFlow(true);
        setTenantAction("search"); // A ação correta é 'search'
        setValue("tenantAction", "search");
        setValue("tenantCpfCnpj", tenantCpfCnpj);

        toast.info("Iniciando Contrato Fácil...", {
          description: "Buscando dados do inquilino pré-selecionado.",
        });

        setSearchingTenant(true);
        try {
          const response: ApiResponse<userProps[]> = await UserService.search({
            cpfCnpj: tenantCpfCnpj,
            role: "LOCATARIO",
          });
          const userList = response.data || [];

          if (userList.length > 0) {
            handleSelectTenant(userList[0]); // Seleciona automaticamente o usuário encontrado
            setCurrentStep(2); // Pula para a próxima etapa
            toast.success("Inquilino selecionado com sucesso!", {
              description: "Agora, preencha os detalhes do contrato.",
            });
          } else {
            toast.error("Inquilino do 'Contrato Fácil' não foi encontrado", {
              description: "Pode ser necessário cadastrá-lo manualmente.",
            });
            setIsEasyContractFlow(false); // Desbloqueia o formulário se o inquilino não for encontrado
          }
        } catch (error) {
          toast.error("Erro ao buscar o inquilino", {
            description: extractAxiosError(error),
          });
          setIsEasyContractFlow(false);
        } finally {
          setSearchingTenant(false);
        }
      }
    };

    startEasyFlow();
  }, [searchParams, setValue, handleSelectTenant, selectedTenant]);

  return (
    <div className=" w-full flex flex-col items-center justify-center">
      <div className="min-h-svh py-24 px-4 md:px-8 grid place-items-center    w-full max-w-2xl">
        <div>
          <h1 className="text-xl md:text-3xl  font-bold text-gray-800  text-center">
            Criar Novo Contrato de Locação
          </h1>
          <p className="text-xs md:text-sm text-gray-500 text-center">
            Siga as etapas para gerar um novo contrato.
          </p>
        </div>

        <Stepper
          steps={steps}
          currentStep={currentStep}
          className="my-8  items-center justify-center flex-row"
        />

        <form onSubmit={handleSubmit(onSubmit)} className="w-full  space-y-6">
          {currentStep === 1 && (
            <fieldset className="border border-border p-4 rounded-lg space-y-4">
              <legend className="px-2 font-bold text-lg text-gray-700">
                1. Dados do Inquilino
              </legend>

              <p className="text-sm text-gray-600">
                {
                  'Para evitar duplicidade, primeiro busque pelo CPF/CNPJ do inquilino. Se ele não for encontrado, utilize a aba "Cadastrar Novo".'
                }
              </p>

              <div className="flex flex-col sm:flex-row w-full bg-gray-200 border border-border rounded-lg p-1 gap-1 sm:gap-0">
                <button
                  type="button"
                  onClick={() => handleActionChange("search")}
                  disabled={isEasyContractFlow}
                  className={`w-full sm:w-1/2 py-2 rounded-md transition-all duration-200 text-sm font-bold ]
                    ${
                      tenantAction === "search"
                        ? "bg-primary text-white shadow-sm"
                        : "bg-transparent text-gray-600"
                    }
                   ${
                     isEasyContractFlow ? "cursor-not-allowed opacity-50" : ""
                   }`}
                >
                  Buscar Existente
                </button>
                <button
                  type="button"
                  onClick={() => handleActionChange("create")}
                  disabled={isEasyContractFlow}
                  className={`w-full sm:w-1/2 py-2 rounded-md transition-all duration-200 text-sm font-bold 
                    ${
                      tenantAction === "create"
                        ? "bg-primary text-white shadow-sm"
                        : "bg-transparent text-gray-600"
                    } ${
                    isEasyContractFlow ? "cursor-not-allowed opacity-50" : ""
                  }`}
                >
                  Cadastrar Novo
                </button>
              </div>

              {tenantAction === "search" && (
                <div className="pt-2 space-y-6">
                  <p className="text-sm text-center text-gray-600">
                    Digite o CPF/CNPJ do inquilino para encontrá-lo na
                    plataforma.
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch gap-2">
                    <div className="grow">
                      <Controller
                        name="tenantCpfCnpj"
                        control={control}
                        render={({ field }) => (
                          <CustomFormInput
                            id="search-cpf"
                            icon={<FileText />}
                            mask="cpfCnpj"
                            label="CPF/CNPJ do inquilino"
                            placeholder="ex: 064.245.353-53"
                            disabled={searchingTenant}
                            className="h-full "
                            error={errors.tenantCpfCnpj?.message}
                            {...field}
                          />
                        )}
                      />
                    </div>
                    <CustomButton
                      onClick={handleSearchTenant}
                      disabled={searchingTenant}
                      className="h-full w-full sm:w-1/6 sm:mt-6"
                    >
                      {searchingTenant ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <>
                          <Search className="sm:hidden" />{" "}
                          <span className="hidden sm:inline">Buscar</span>{" "}
                        </>
                      )}
                    </CustomButton>
                  </div>

                  {foundTenants.length > 0 && (
                    <div className="w-full space-y-3 border-t border-border pt-4 animate-fade-in">
                      <h3 className="font-semibold text-gray-700">
                        Usuários existentes:
                      </h3>
                      {foundTenants.map((user) => (
                        <div
                          key={user.id}
                          className="w-full p-4 bg-gray-50 rounded-lg border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="shrink-0 bg-secondary text-white rounded-full h-10 w-10 flex items-center justify-center font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-secondary">
                                {user.name}
                              </p>
                              <p className="text-sm text-gray-600  break-all">
                                {cpfCnpjMask(user.cpfCnpj!)}
                              </p>
                              <p className="text-sm text-gray-500 break-all">
                                {user.email}
                              </p>
                            </div>
                          </div>

                          <CustomButton
                            onClick={() => handleSelectTenant(user)}
                            color="bg-green-600"
                            textColor="text-white"
                            className="w-full sm:w-auto mt-2 sm:mt-0"
                          >
                            {/* <CheckCircle size={16} className="mr-2" /> */}
                            Selecionar
                          </CustomButton>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedTenant && (
                    <div
                      className="w-full p-4 bg-primary/10 border-2 border-primary/20 rounded-lg animate-fade-in"
                      role="group"
                      aria-label="Inquilino Selecionado"
                    >
                      <p className="text-sm font-semibold text-primary mb-2">
                        Inquilino Selecionado:
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="shrink-0">
                          <UserIcon className="w-8 h-8 text-primary" />
                        </div>
                        <div className="grow">
                          <p className="font-bold text-lg text-gray-800 break-all">
                            {selectedTenant.name}
                          </p>
                          <p className="text-sm text-gray-600 break-all">
                            {cpfCnpjMask(selectedTenant.cpfCnpj!)}
                          </p>
                          <p className="text-sm text-gray-600 break-all">
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
                  </p>{" "}
                  <Controller
                    name="tenantName"
                    control={control}
                    render={({ field }) => (
                      <CustomFormInput
                        id="tenantName"
                        label="Nome Completo*"
                        autoComplete="name"
                        autoCapitalize="words"
                        placeholder="John Doe"
                        icon={<UserIcon />}
                        error={errors.tenantName?.message}
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="tenantCpfCnpj"
                    control={control}
                    render={({ field }) => (
                      <CustomFormInput
                        id="tenantCpfCnpj"
                        label="CPF/CNPJ*"
                        placeholder="000.000.000-00"
                        mask="cpfCnpj"
                        icon={<FileText />}
                        error={errors.tenantCpfCnpj?.message}
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="tenantEmail"
                    control={control}
                    render={({ field }) => (
                      <CustomFormInput
                        id="tenantEmail"
                        label="E-mail*"
                        autoComplete="email"
                        placeholder="johndoe@gmail.com"
                        icon={<Mail />}
                        error={errors.tenantEmail?.message}
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="tenantPhone"
                    control={control}
                    render={({ field }) => (
                      <CustomFormInput
                        id="tenantPhone"
                        label="Celular*"
                        autoComplete="tel"
                        mask="phone"
                        maxLength={15}
                        placeholder="(89) 9 9417-8403"
                        icon={<PhoneIncoming />}
                        error={errors.tenantPhone?.message}
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="tenantPassword"
                    control={control}
                    render={({ field }) => (
                      <CustomFormInput
                        type="password"
                        id="tenantPassword"
                        label="Senha (Mínimo de 6 dígitos)"
                        placeholder="******"
                        icon={<Lock />}
                        error={errors.tenantPassword?.message}
                        {...field}
                      />
                    )}
                  />
                </div>
              )}
            </fieldset>
          )}

          {currentStep === 2 && (
            <fieldset className="border border-border p-4 rounded-lg">
              <legend className="px-2 font-bold text-lg text-gray-700">
                2. Informações do Contrato
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 pt-2">
                <div className="col-span-2">
                  <Controller
                    name="rentAmount"
                    control={control}
                    render={({ field }) => (
                      <CustomFormInput
                        id="rentAmount"
                        placeholder="ex: 1.650,00"
                        icon={<DollarSign />}
                        label="Valor do Aluguel*"
                        error={errors.rentAmount?.message}
                        mask="numeric"
                        {...field}
                      />
                    )}
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <Controller
                    name="condoFee"
                    control={control}
                    render={({ field }) => (
                      <CustomFormInput
                        id="condoFee"
                        icon={<DollarSign />}
                        placeholder="ex: 125,00"
                        label="Taxa de Condomínio"
                        error={errors.condoFee?.message}
                        mask="numeric"
                        {...field}
                      />
                    )}
                  />
                  <p className="text-xs text-gray-500 mt-1 pl-1">
                    (Opcional) Taxa mensal do condomínio.
                  </p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <Controller
                    name="iptuFee"
                    control={control}
                    render={({ field }) => (
                      <CustomFormInput
                        id="iptuFee"
                        placeholder="ex: 13,00"
                        label="IPTU (mensal)"
                        icon={<Building />}
                        error={errors.iptuFee?.message}
                        mask="numeric"
                        {...field}
                      />
                    )}
                  />
                  <p className="text-xs text-gray-500 mt-1 pl-1">
                    (Opcional) Valor mensal do IPTU.
                  </p>
                </div>
                <div className="col-span-2">
                  <CustomDropdownInput
                    placeholder="Selecione a modalidade"
                    label="Tipo de Garantia*"
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
                  <div className="col-span-2">
                    <Controller
                      name="securityDeposit"
                      control={control}
                      render={({ field }) => (
                        <CustomFormInput
                          id="securityDeposit"
                          placeholder="500,00"
                          label="Depósito Caução"
                          icon={<DollarSign />}
                          mask="numeric"
                          error={errors.securityDeposit?.message}
                          {...field}
                        />
                      )}
                    />
                    <p className="text-xs text-gray-500 mt-1 pl-1">
                      Valor que fica retido como garantia.
                    </p>
                  </div>
                )}
                <div className="col-span-2 md:col-span-1">
                  {/* <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <CustomFormInput
                        id="startDate"
                        placeholder="08/08/2002"
                        label="Data de Início*"
                        icon={<Calendar />}
                        mask="date"
                        error={errors.startDate?.message}
                        {...field}
                      />
                    )}
                  /> */}
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <CustomFormInput
                        id="startDate"
                        placeholder="08/08/2002"
                        label="Data de Início*"
                        type="date"
                        icon={<CalendarIcon size={20} />}
                        error={errors.startDate?.message}
                        {...field}
                      />
                    )}
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <Controller
                    name="durationInMonths"
                    control={control}
                    render={({ field }) => (
                      <CustomFormInput
                        id="durationInMonths"
                        label="Duração (meses)*"
                        placeholder="12"
                        icon={<Clock />}
                        type="number"
                        error={errors.durationInMonths?.message}
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>
            </fieldset>
          )}

          {currentStep === 3 && (
            <>
              {tenantAction === "create" && newTenantCredentials ? (
                <div className="text-center space-y-6 p-4 animate-fade-in">
                  <LottieAnimation
                    animationData={successAnimation}
                    className="w-32 h-32 mx-auto"
                  />
                  <h2 className="text-2xl font-bold text-gray-800">
                    Contrato Criado e Inquilino Cadastrado!
                  </h2>
                  <p className="text-gray-600">
                    Guarde as informações de acesso abaixo e compartilhe com o
                    inquilino.
                  </p>

                  <div
                    ref={credentialsCardRef}
                    className="bg-gray-50 border border-border rounded-lg p-6 text-left space-y-4"
                  >
                    <h3 className="font-bold text-lg text-gray-700 text-center mb-4">
                      Dados de Acesso do Inquilino
                    </h3>
                    <div className="flex items-center gap-4">
                      <User className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Login (E-mail)</p>
                        <p className="font-mono text-gray-800">
                          {newTenantCredentials.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <KeyRound className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Senha</p>
                        <p className="font-mono text-gray-800">
                          {newTenantCredentials.password}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 border-t border-border pt-4 mt-4">
                      <Globe className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Acessar em</p>
                        <a
                          href="https://www.locaterra.com.br"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-primary hover:underline"
                        >
                          www.locaterra.com.br
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <CustomButton onClick={handleSaveCredentials} type="button">
                      <Save className="w-4 h-4 mr-2" />
                      Salvar
                    </CustomButton>
                    <CustomButton
                      onClick={handleShareCredentials}
                      type="button"
                      color="bg-secondary"
                    >
                      {canShare ? (
                        <Share2 className="w-4 h-4 mr-2" />
                      ) : (
                        <Copy className="w-4 h-4 mr-2" />
                      )}
                      {canShare ? "Compartilhar" : "Copiar"}
                    </CustomButton>
                  </div>

                  <CustomButton
                    onClick={() => router.push(`/imoveis`)}
                    fontSize="text-lg"
                    className="mt-4 border border-border mx-auto"
                    ghost
                  >
                    Voltar ao menu
                  </CustomButton>
                </div>
              ) : (
                <div className="text-center space-y-4 p-8">
                  <LottieAnimation
                    animationData={successAnimation}
                    className="w-32 h-32 mx-auto"
                  />
                  <h2 className="text-2xl font-bold text-gray-800">
                    Contrato Criado com Sucesso!
                  </h2>
                  <p className="text-gray-600">
                    O inquilino receberá as instruções por e-mail para dar
                    continuidade ao processo de locação.
                  </p>
                  <CustomButton
                    onClick={() => router.push(`/imoveis`)}
                    fontSize="text-lg"
                    className="mt-4 border border-border mx-auto"
                    ghost
                  >
                    Voltar ao menu
                  </CustomButton>
                </div>
              )}
            </>
          )}

          <div className="flex flex-col md:flex-row-reverse pt-4 gap-4">
            {currentStep === 2 && (
              <CustomButton
                type="submit"
                disabled={loading}
                fontSize="text-lg"
                className="w-full md:w-auto"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    Gerar Contrato <FilePen className="w-5 h-5 ml-2" />
                  </>
                )}
              </CustomButton>
            )}

            {currentStep < 2 && (
              <CustomButton
                onClick={nextStep}
                disabled={loading}
                className="w-full md:w-auto"
              >
                Próximo
                <ChevronRight className="w-5 h-5 ml-2" />
              </CustomButton>
            )}

            {currentStep > 1 && currentStep < 3 && (
              <CustomButton
                onClick={prevStep}
                disabled={loading}
                className="w-full md:w-auto md:ml-auto"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Anterior
              </CustomButton>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
