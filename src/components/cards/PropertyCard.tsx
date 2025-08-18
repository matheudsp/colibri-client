"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { PropertyProps } from "@/interfaces/property";
import {
  Home,
  Edit,
  Trash2,
  Bed,
  Bath,
  Car,
  Maximize,
  MapPin,
  FilePlus2,
  Eye,
} from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { Roles } from "@/constants/userRole";
import { CustomButton } from "@/components/forms/CustomButton";

export function PropertyCard(props: PropertyProps) {
  const router = useRouter();
  const { role, loading } = useUserRole();

  const coverPhoto =
    props.photos?.find((p) => p.isCover) ||
    (props.photos?.length > 0 ? props.photos[0] : null);

  const handleNavigateToDetails = () => {
    router.push(`/properties/${props.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/properties/edit/${props.id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (props.onDelete) {
      props.onDelete(props.id);
    }
  };

  const handleCreateContract = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/properties/${props.id}/create-contract`);
  };

  const showActionButtons = !loading;
  const showAdminButtons = role === Roles.ADMIN || role === Roles.LOCADOR;
  const showPropertyInfo = props.showPropertyInformation ?? false;
  return (
    <div
      className={`w-full bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col md:flex-row relative`}
    >
      <div className="relative w-full md:w-2/5 h-56 md:h-auto">
        {coverPhoto ? (
          <Image
            src={coverPhoto.signedUrl}
            alt={`Foto principal de ${props.title}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
            <Home size={60} />
          </div>
        )}
      </div>

      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-4">
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                {props.title}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="bg-primary p-2 rounded-xl">
                  <MapPin size={14} className="text-white" />
                </div>
                <p className="flex items-center  text-sm text-gray-500 ">
                  {props.district}, {props.city} - {props.state}
                </p>
              </div>
            </div>
          </div>
          <p className="text-base text-gray-600 mt-3 line-clamp-3">
            {props.description}
          </p>
        </div>

        {showPropertyInfo && (
          <div className="mt-5 pt-5 border-t border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div
              className="flex flex-col items-center justify-center"
              title="Área total"
            >
              <Maximize size={20} className="text-primary mb-1" />
              <p className="text-sm text-gray-500">Área</p>
              <p className="font-bold text-base text-gray-800">
                {props.areaInM2} m²
              </p>
            </div>
            <div
              className="flex flex-col items-center justify-center"
              title="Número de quartos"
            >
              <Bed size={20} className="text-primary mb-1" />
              <p className="text-sm text-gray-500">Quartos</p>
              <p className="font-bold text-base text-gray-800">
                {props.numRooms}
              </p>
            </div>
            <div
              className="flex flex-col items-center justify-center"
              title="Número de banheiros"
            >
              <Bath size={20} className="text-primary mb-1" />
              <p className="text-sm text-gray-500">Banheiros</p>
              <p className="font-bold text-base text-gray-800">
                {props.numBathrooms}
              </p>
            </div>
            <div
              className="flex flex-col items-center justify-center"
              title="Vagas de garagem"
            >
              <Car size={20} className="text-primary mb-1" />
              <p className="text-sm text-gray-500">Vagas</p>
              <p className="font-bold text-base text-gray-800">
                {props.numParking}
              </p>
            </div>
          </div>
        )}

        {showActionButtons && (
          <div className="mt-5 pt-5 border-t border-gray-200 space-y-3">
            <CustomButton
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                handleNavigateToDetails();
              }}
              icon={<Eye size={18} />}
              color="bg-secondary"
              textColor="text-white"
              className="w-full py-3 text-base font-semibold"
              title="Ver detalhes do imóvel"
            >
              Ver Detalhes
            </CustomButton>

            {showAdminButtons && (
              <div className="grid grid-cols-1 gap-3">
                <CustomButton
                  onClick={handleCreateContract}
                  icon={<FilePlus2 size={16} />}
                  color="bg-primary"
                  textColor="text-white"
                  className="w-full py-3 text-sm font-semibold"
                  title="Contrato"
                >
                  Criar Contrato
                </CustomButton>
                <CustomButton
                  onClick={handleEdit}
                  icon={<Edit size={16} />}
                  color="bg-blue-100"
                  textColor="text-blue-800"
                  className="w-full py-3 text-sm font-semibold"
                  title="Editar Imóvel"
                >
                  Editar
                </CustomButton>
                <CustomButton
                  onClick={handleDelete}
                  icon={<Trash2 size={16} />}
                  color="bg-red-100"
                  textColor="text-red-800"
                  className="w-full py-3 text-sm font-semibold"
                  title="Excluir Imóvel"
                >
                  Excluir
                </CustomButton>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
