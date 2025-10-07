"use client";

import React from "react";
import PageHeader from "@/components/common/PageHeader";
import { CalendarArrowDown } from "lucide-react";

import { PaymentListWithFilters } from "@/components/lists/PaymentsListWithFilters";

export default function MyPaymentsPage() {
  return (
    <div className="min-h-svh flex flex-col items-center pt-8 md:pt-14 px-4 pb-32 ">
      <div className="w-full max-w-7xl mx-auto">
        <PageHeader
          className="mb-8"
          title="Minhas Faturas"
          subtitle="Consulte o seu histórico de faturas e acompanhe seus boletos."
          icon={CalendarArrowDown}
        />
        <PaymentListWithFilters />
      </div>
    </div>
  );
}
