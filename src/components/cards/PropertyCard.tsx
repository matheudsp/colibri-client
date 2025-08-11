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
  User,
} from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { Roles } from "@/constants/userRole";

export function PropertyCard(props: PropertyProps) {
  const router = useRouter();
  const { role, loading } = useUserRole();

  const coverPhoto =
    props.photos?.find((p) => p.isCover) ||
    (props.photos?.length > 0 ? props.photos[0] : null);

  const handleCardClick = () => {
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

  const showActionButtons =
    !loading && (role === Roles.ADMIN || role === Roles.LOCADOR);

  return (
    <div
      onClick={handleCardClick}
      className={`w-full bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col md:flex-row relative cursor-pointer`}
    >
      {/* Imagem */}
      <div className="relative w-full md:w-2/5 h-56 md:h-auto">
        {coverPhoto ? (
          <Image
            src={coverPhoto.signedUrl}
            alt={`Foto principal de ${props.title}`}
            fill
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
            <Home size={60} />
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-4">
            {/* Título e Localização */}
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                {props.title}
              </h3>
              <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                <MapPin size={14} />
                {props.district}, {props.city} - {props.state}
              </p>
            </div>
            {/* Botões de Ação */}
            {showActionButtons && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-1.5 py-2 px-3 text-sm font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                  title="Editar Imóvel"
                >
                  <Edit size={16} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 py-2 px-3 text-sm font-semibold text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                  title="Excluir Imóvel"
                >
                  <Trash2 size={16} />
                  <span>Excluir</span>
                </button>
              </div>
            )}
          </div>

          {/* Nome do Locador (condicional) */}
          {/* {showActionButtons && props.landlord && (
            <div className="flex items-center gap-2 mt-3 text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
              <User size={16} className="text-gray-500 flex-shrink-0" />
              <span className="font-semibold">Locador:</span>
              <span>{props.landlord.name}</span>
            </div>
          )} */}

          {/* Descrição */}
          <p className="text-base text-gray-600 mt-3 line-clamp-3">
            {props.description}
          </p>
        </div>

        {/* Detalhes do Imóvel */}
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
      </div>
    </div>
  );
}
