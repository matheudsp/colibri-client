import { PaymentStatus } from "@/constants";
import { HiOutlineClock } from "react-icons/hi2";
import { GoXCircle } from "react-icons/go";
import type { JSX } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
export const statusMap: Record<
  PaymentStatus,
  { label: string; color: string; icon: JSX.Element }
> = {
  PENDENTE: {
    label: "Pendente",
    color: "border-yellow-500 bg-yellow-50 text-yellow-700",
    icon: <HiOutlineClock size={14} />,
  },
  RECEBIDO: {
    label: "Pago",
    color: "border-green-500 bg-green-50 text-green-700",
    icon: <IoMdCheckmarkCircleOutline size={14} />,
  },
  PAGO: {
    label: "Pago",
    color: "border-green-500 bg-green-50 text-green-700",
    icon: <IoMdCheckmarkCircleOutline size={14} />,
  },
  EM_REPASSE: {
    label: "Pago",
    color: "border-green-500 bg-green-50 text-green-700",
    icon: <IoMdCheckmarkCircleOutline size={14} />,
  },
  ATRASADO: {
    label: "Atrasado",
    color: "border-red-500 bg-red-50 text-red-700",
    icon: <HiOutlineClock size={14} />,
  },
  CANCELADO: {
    label: "Cancelado",
    color: "border-gray-400 bg-gray-50 text-gray-600",
    icon: <GoXCircle size={14} />,
  },
  ISENTO: {
    label: "Isento",
    color: "border-blue-500 bg-blue-50 text-blue-700",
    icon: <IoMdCheckmarkCircleOutline size={14} />,
  },
  CONFIRMADO: {
    label: "Confirmado",
    color: "border-green-500 bg-green-50 text-green-700",
    icon: <IoMdCheckmarkCircleOutline size={14} />,
  },
  FALHOU: {
    label: "Falhou",
    color: "border-red-500 bg-red-50 text-red-700",
    icon: <GoXCircle size={14} />,
  },
};
