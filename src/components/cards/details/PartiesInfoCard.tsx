import { Contract } from "@/interfaces/contract";
import { User } from "lucide-react";

const PartyItem = ({
  role,
  name,
  email,
}: {
  role: string;
  name: string;
  email?: string;
}) => (
  <div>
    <p className="text-sm text-gray-500">{role}</p>
    <div className="flex items-center gap-2 mt-1">
      <div className="bg-primary p-2 rounded-xl">
        <User className="w-6 h-6 text-white" />
      </div>
      <div className="flex-col">
        <p className="font-semibold text-gray-800">{name}</p>
        <p className="font-normal text-gray-600">{email}</p>
      </div>
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
        <PartyItem
          role="Locador"
          name={contract.landlord.name}
          email={contract.landlord.email}
        />
        <PartyItem
          role="Inquilino"
          name={contract.tenant.name}
          email={contract.tenant.email}
        />
      </div>
    </div>
  );
}
