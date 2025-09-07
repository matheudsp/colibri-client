"use client";

import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { Modal } from "@/components/modals/Modal";
import { CustomButton } from "@/components/forms/CustomButton";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";
import type { ApiResponse } from "@/types/api";

interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (otp: string) => Promise<void>;
  onResendOtp: () => Promise<ApiResponse<{ message: string }>>;
  isLoading: boolean;
  title: string;
  description: string;
  actionText?: string;
  codeAlreadySent?: boolean;
}

export function OtpVerificationModal({
  isOpen,
  onClose,
  onConfirm,
  onResendOtp,
  isLoading,
  title,
  description,
  actionText = "Confirmar",
  codeAlreadySent = false,
}: OtpVerificationModalProps) {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [isInitialSend, setIsInitialSend] = useState(!codeAlreadySent);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (codeAlreadySent) {
        setIsInitialSend(false);
        setCountdown(60);
        inputRefs.current[0]?.focus();
      }
    } else {
      // Reseta o estado ao fechar, respeitando a prop
      setOtp(new Array(6).fill(""));
      setIsInitialSend(!codeAlreadySent);
      setCountdown(0);
    }
  }, [isOpen, codeAlreadySent]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOrResendCode = async () => {
    if (countdown > 0) return;
    try {
      const response = await onResendOtp();
      toast.success(
        response.data.message || "Código enviado para o seu e-mail."
      );
      if (isInitialSend) setIsInitialSend(false);
      setCountdown(60);
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error("Falha ao enviar código", {
        description:
          error instanceof Error ? error.message : "Tente novamente.",
      });
    }
  };

  const handleConfirm = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Por favor, insira o código de 6 dígitos.");
      return;
    }
    try {
      await onConfirm(otpCode);
    } catch (error) {
      toast.error("Falha na Verificação", {
        description:
          error instanceof Error
            ? error.message
            : "Código inválido ou expirado.",
      });
    }
  };

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData("text");
    if (paste.length === 6 && /^\d+$/.test(paste)) {
      const newOtp = paste.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const buttonText = isInitialSend
    ? "Enviar Código"
    : `Reenviar Código ${countdown > 0 ? `(${countdown}s)` : ""}`;

  const modalDescription = isInitialSend
    ? description
    : "Um código de 6 dígitos foi enviado para o seu e-mail. Insira-o abaixo para continuar.";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-gray-600 text-center mb-4">{modalDescription}</p>

      <div
        className="flex justify-between items-center gap-1 sm:gap-2 my-4"
        onPaste={handlePaste}
      >
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            disabled={isLoading || isInitialSend}
            className={clsx(
              "aspect-square w-full max-w-14 h-auto text-center text-xl sm:text-2xl font-semibold border-2 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary transition",
              {
                "bg-gray-100 cursor-not-allowed": isInitialSend,
              }
            )}
          />
        ))}
      </div>

      <div className="text-center my-4">
        <button
          onClick={handleSendOrResendCode}
          className="text-sm text-secondary hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
          disabled={isLoading || countdown > 0}
        >
          {buttonText}
        </button>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
        <CustomButton
          color="bg-gray-200"
          textColor="text-gray-800"
          onClick={onClose}
          className="w-full"
          disabled={isLoading}
        >
          Cancelar
        </CustomButton>
        <CustomButton
          onClick={handleConfirm}
          disabled={isLoading || isInitialSend || otp.join("").length !== 6}
          color="bg-primary"
          textColor="text-secondary"
          className="w-full"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : actionText}
        </CustomButton>
      </div>
    </Modal>
  );
}
