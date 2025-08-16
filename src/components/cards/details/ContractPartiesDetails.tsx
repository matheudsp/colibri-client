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
    <div className="flex items-center gap-3 mt-1">
      <div className="bg-primary p-2 rounded-xl flex-shrink-0">
        <User className="w-6 h-6 text-white" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 truncate" title={name}>
          {name}
        </p>
        <p className="font-normal text-gray-600 truncate" title={email}>
          {email}
        </p>
      </div>
    </div>
  </div>
);

export function ContractPartiesDetails({ contract }: { contract: Contract }) {
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
