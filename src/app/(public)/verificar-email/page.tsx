"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

import { AuthService } from "@/services/domains/authService";
import { extractAxiosError } from "@/services/api";
import { CustomButton } from "@/components/forms/CustomButton";

type VerificationStatus = "verifying" | "success" | "error";

function VerifyEmailComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<VerificationStatus>("verifying");
  const [message, setMessage] = useState(
    "Verificando seu e-mail, por favor, aguarde..."
  );

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage(
        "Token de verificação não encontrado. Por favor, solicite um novo link."
      );
      return;
    }

    const verify = async () => {
      try {
        const response = await AuthService.verifyEmail(token);
        setStatus("success");
        setMessage(response.data.message || "E-mail verificado com sucesso!");
        toast.success("E-mail verificado com sucesso!");
      } catch (error) {
        setStatus("error");
        const errorMessage = extractAxiosError(error);
        setMessage(errorMessage);
        toast.error("Falha na verificação", { description: errorMessage });
      }
    };

    verify();
  }, [searchParams]);

  const renderContent = () => {
    switch (status) {
      case "verifying":
        return <Loader2 className="animate-spin text-primary" size={48} />;
      case "success":
        return <CheckCircle className="text-green-500" size={48} />;
      case "error":
        return <XCircle className="text-red-500" size={48} />;
    }
  };

  const titleText = {
    verifying: "Verificando...",
    success: "Verificação Concluída!",
    error: "Ocorreu um Erro",
  };

  return (
    <div className="w-full max-w-md text-center bg-white p-8 rounded-xl shadow-lg border">
      <div className="mx-auto mb-6 w-16 h-16 flex items-center justify-center">
        {renderContent()}
      </div>
      <h1 className="text-2xl font-bold text-secondary mb-2">
        {titleText[status]}
      </h1>
      <p className="text-gray-600 mb-8">{message}</p>
      <CustomButton
        onClick={() => router.push("/entrar")}
        className="w-full"
        fontSize="text-lg"
      >
        Ir para o Login
      </CustomButton>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-svh w-full bg-gray-50 flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-screen">
            <Loader2 className="animate-spin text-primary" size={48} />
          </div>
        }
      >
        <VerifyEmailComponent />
      </Suspense>
    </div>
  );
}
