import { Contract } from "@/interfaces/contract";
import { User } from "lucide-react";

const PartyItem = ({ role, name }: { role: string; name: string }) => (
  <div>
    <p className="text-sm text-gray-500">{role}</p>
    <div className="flex items-center gap-2 mt-1">
      <User className="w-5 h-5 text-gray-400" />
      <p className="font-semibold text-gray-800">{name}</p>
    </div>
  </div>
);

export function PartiesInfoCard({ contract }: { contract: Contract }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border">
      <h2 className="font-bold text-xl mb-4 border-b pb-2">
        Partes Envolvidas
      </h2>
      <div className="space-y-4">
        <PartyItem role="Locador" name={contract.landlord.name} />
        <PartyItem role="Inquilino" name={contract.tenant.name} />
      </div>
    </div>
  );
}
