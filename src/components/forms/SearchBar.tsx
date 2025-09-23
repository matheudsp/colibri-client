"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { CustomButton } from "./CustomButton";
import { propertyType as propertyTypeOptions } from "@/constants";

const transactionOptions = [
  { id: "LOCACAO", slug: "para-alugar", label: "Locação" },
  { id: "VENDA", slug: "a-venda", label: "Venda" },
];
export function SearchBar() {
  const router = useRouter();
  const [transaction, setTransaction] = useState("LOCACAO");
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [isPropertyTypeOpen, setIsPropertyTypeOpen] = useState(false);

  const handleSearch = () => {
    const transactionSlug = transaction === "VENDA" ? "a-venda" : "para-alugar";
    const path = `/imoveis/${transactionSlug}`;

    const queryParams = new URLSearchParams();

    if (location.trim()) {
      queryParams.set("q", location.trim());
    }

    if (propertyType) {
      queryParams.set("propertyType", propertyType);
    }

    queryParams.set("transactionType", transaction);

    router.push(`${path}?${queryParams.toString()}`);
  };

  const getPropertyTypeLabel = () => {
    return (
      propertyTypeOptions.find(
        (opt: { value: string; label: string }) => opt.value === propertyType
      )?.label || "Tipo de imóvel"
    );
  };

  const baseButtonClass =
    "flex items-center justify-between w-full h-full px-4 text-gray-700 focus:outline-hidden bg-white shadow-xs md:shadow-none";

  return (
    <div className="w-full max-w-4xl relative flex flex-col md:flex-row md:rounded-full md:shadow-lg md:h-14 space-y-3 md:space-y-0 ">
      <div className="relative w-full md:w-36 h-14 md:h-full ">
        <button
          onClick={() => setIsTransactionOpen(!isTransactionOpen)}
          className={`${baseButtonClass} rounded-full md:rounded-l-full md:rounded-r-none cursor-pointer`}
        >
          <span className="font-medium mx-auto text-sm  text-gray-800">
            {transaction === "LOCACAO" ? "Locação" : "Venda"}
          </span>
          <ChevronDown
            className={`h-5 w-5 transition-transform text-gray-400  ${
              isTransactionOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isTransactionOpen && (
          <div className="absolute top-full mt-2 w-full bg-white py-1 divide-y rounded-md shadow-xs shadow-black/70 border border-border z-10 ">
            {transactionOptions.map((opt) => (
              <div
                key={opt.id}
                onClick={() => {
                  setTransaction(opt.id);
                  setIsTransactionOpen(false);
                }}
                className="px-4 md:py-2 py-4 hover:bg-primary text-start font-medium flex items-center cursor-pointer hover:text-white text-gray-700 text-xs  "
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-full border-x border-border self-center hidden md:block "></div>

      <div className="relative w-full md:w-40 h-14 md:h-full ">
        <button
          onClick={() => setIsPropertyTypeOpen(!isPropertyTypeOpen)}
          className={`${baseButtonClass} rounded-full md:rounded-none cursor-pointer`}
        >
          <span
            className={`${
              propertyType
                ? "text-gray-800 font-medium"
                : "text-gray-500 font-normal"
            } text-sm mx-auto`}
          >
            {getPropertyTypeLabel()}
          </span>
          <ChevronDown
            className={`h-5 w-5 text-gray-400 transition-transform ${
              isPropertyTypeOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isPropertyTypeOpen && (
          <div className="absolute top-full mt-2 w-full bg-white py-1 divide-y rounded-md shadow-xs shadow-black/70 border border-border z-10 ">
            {propertyTypeOptions.map((opt) => (
              <div
                key={opt.id}
                onClick={() => {
                  setPropertyType(opt.value);
                  setIsPropertyTypeOpen(false);
                }}
                className="px-4 md:py-2 py-4 hover:bg-primary text-start font-medium flex items-center cursor-pointer hover:text-white text-gray-700 text-xs  "
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-full border-x border-border self-center hidden md:block "></div>

      <div className="grow flex items-center h-14 md:h-full bg-white rounded-full md:rounded-none shadow-xs md:shadow-none">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Digite uma rua, bairro ou cidade"
          className="w-full h-full px-4 border-none focus:ring-0 md:focus:outline-primary md:focus:-outline-offset-2 focus:outline-hidden focus:-outline-offset-0 md:placeholder:text-start text-center md:text-start placeholder:text-center bg-transparent text-gray-800 placeholder-gray-500 text-sm"
        />
      </div>
      <div className="h-full border-x border-border self-center hidden md:block "></div>
      <div className="w-full md:w-auto h-full md:h-full">
        <CustomButton
          onClick={handleSearch}
          fontSize="text-sm xs:font-bold "
          rounded="rounded-full md:rounded-none md:rounded-r-full"
          className="w-full md:w-auto md:py-0 py-4 h-full px-8 md:border-white md:border cursor-pointer"
          color="bg-primary hover:bg-secondary-hover md:bg-black/25"
          textColor="text-secondary md:text-white "
        >
          Buscar
        </CustomButton>
      </div>
    </div>
  );
}
