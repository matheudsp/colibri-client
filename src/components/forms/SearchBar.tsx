"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { CustomButton } from "./CustomButton";

const transactionOptions = [
  { id: "locacao", label: "Locação" },
  { id: "venda", label: "Venda" },
];

const propertyTypeOptions = [
  { id: "apartamento", label: "Apartamento" },
  { id: "casa", label: "Casa" },
  { id: "terreno", label: "Terreno" },
  { id: "comercial", label: "Comercial" },
];

export function SearchBar() {
  const [transaction, setTransaction] = useState("locacao");
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [location, setLocation] = useState("");

  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [isPropertyTypeOpen, setIsPropertyTypeOpen] = useState(false);

  const handleSearch = () => {
    console.log({
      transaction,
      propertyType,
      location,
    });
  };

  const getPropertyTypeLabel = () => {
    return (
      propertyTypeOptions.find((opt) => opt.id === propertyType)?.label ||
      "Tipo de imóvel"
    );
  };

  const baseButtonClass =
    "flex items-center justify-between w-full h-full px-4 text-gray-700 focus:outline-none bg-white shadow-md md:shadow-none";

  return (
    <div className="w-full max-w-4xl relative flex flex-col md:flex-row  md:rounded-full md:shadow-lg md:h-10 space-y-3 md:space-y-0 ">
      <div className="relative w-full md:w-36 h-10 md:h-full ">
        <button
          onClick={() => setIsTransactionOpen(!isTransactionOpen)}
          className={`${baseButtonClass} rounded-full md:rounded-l-full md:rounded-r-none`}
        >
          <span className="font-normal mx-auto text-sm text-gray-800">
            {transaction === "locacao" ? "Locação" : "Venda"}
          </span>
          <ChevronDown
            className={`h-5 w-5 transition-transform text-gray-400  ${
              isTransactionOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isTransactionOpen && (
          <div className="absolute top-full mt-2 w-full bg-white py-2 rounded-md shadow-md shadow-gray-700 border   z-10">
            {transactionOptions.map((opt) => (
              <div
                key={opt.id}
                onClick={() => {
                  setTransaction(opt.id);
                  setIsTransactionOpen(false);
                }}
                className="px-4 py-2 hover:bg-primary text-start cursor-pointer hover:text-white text-gray-700 text-xs font-light "
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-full border-x border-gray-200 self-center hidden md:block "></div>

      <div className="relative w-full md:w-40 h-10 md:h-full">
        <button
          onClick={() => setIsPropertyTypeOpen(!isPropertyTypeOpen)}
          className={`${baseButtonClass} rounded-full md:rounded-none`}
        >
          <span
            className={`${
              propertyType ? "text-gray-800" : "text-gray-500"
            } font-normal text-sm mx-auto`}
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
          <div className="absolute top-full mt-2 w-full bg-white py-2 rounded-md shadow-md shadow-gray-700 border   z-10">
            {propertyTypeOptions.map((opt) => (
              <div
                key={opt.id}
                onClick={() => {
                  setPropertyType(opt.id);
                  setIsPropertyTypeOpen(false);
                }}
                className="px-4 py-2 hover:bg-primary text-start cursor-pointer hover:text-white text-gray-700 text-xs font-light "
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-full border-x border-gray-200 self-center hidden md:block "></div>

      <div className="flex-grow flex items-center h-10 md:h-full bg-white rounded-full md:rounded-none shadow-md md:shadow-none">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Digite uma rua, bairro ou cidade"
          className="w-full h-full px-4 border-none focus:ring-0 focus:md:outline-primary md:focus:-outline-offset-2 focus:outline-none  focus:-outline-offset-0  placeholder:md:text-start text-center md:text-start placeholder:text-center  bg-transparent text-gray-800 placeholder-gray-500 text-sm"
        />
      </div>
      <div className="h-full border-x border-gray-200 self-center hidden md:block "></div>
      <div className="w-full md:w-auto h-full md:h-full">
        <CustomButton
          onClick={handleSearch}
          fontSize="text-sm font-bold "
          rounded="rounded-full md:rounded-none md:rounded-r-full"
          className="w-full md:w-auto md:py-0 py-4 h-full px-8 md:border-white md:border"
          color="bg-primary hover:bg-primary-hover md:bg-secondary-hover"
          textColor="text-secondary md:text-white"
        >
          Buscar
        </CustomButton>
      </div>
    </div>
  );
}
