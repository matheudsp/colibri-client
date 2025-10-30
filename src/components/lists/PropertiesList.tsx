"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PropertyResponse } from "@/services/domains/propertyService";

import { PropertyCardSkeleton } from "../skeletons/PropertyCardSkeleton";
import { PropertyCard } from "../cards/PropertyCard";

import notFoundAnimation from "../../../public/lottie/not-found-animation.json";

import dynamic from "next/dynamic";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { cn } from "@/lib/utils";
import { CustomButton } from "../forms/CustomButton";

const LottieAnimation = dynamic(
  () =>
    import("@/components/common/LottieAnimation").then(
      (mod) => mod.LottieAnimation
    ),
  { ssr: false }
);
interface PropertiesListProps {
  title: string;
  properties: PropertyResponse[];
  isLoading?: boolean;
  viewAllLink?: string;
  className?: string;
}

export function PropertiesList({
  title,
  properties,
  isLoading,
  viewAllLink,
  className,
}: PropertiesListProps) {
  return (
    <div className={cn("w-full px-6", className)}>
      <div className=" flex flex-col items-start mb-6 gap-2 md:flex-row md:justify-between md:items-center md:mb-8 md:gap-1">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          {title}
        </h2>
        {viewAllLink && (
          <Link href={viewAllLink} className="self-end">
            <CustomButton className="group text-sm text-accent-foreground hover:bg-accent hover:text-accent-foreground rounded-full px-4">
              Ver todos
              <ArrowRight className=" h-4 w-4 transition-transform group-hover:translate-x-1" />
            </CustomButton>
          </Link>
        )}
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full relative"
      >
        <CarouselContent className={cn("-ml-4 pb-4", "scrollbar-hide")}>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="pl-4 basis-full xs:basis-[calc(50%-1rem)] sm:basis-[320px]"
              >
                <PropertyCardSkeleton variant="public" />
              </CarouselItem>
            ))
          ) : properties.length > 0 ? (
            properties.map((property) => (
              <CarouselItem
                key={property.id}
                className="pl-4 basis-full xs:basis-[calc(50%-1rem)] sm:basis-[320px] animate-fade animate-once animate-duration-500 animate-ease-in-out"
              >
                <PropertyCard property={property} variant="public" />
              </CarouselItem>
            ))
          ) : (
            <CarouselItem className="basis-full pl-4">
              <div className="flex flex-col items-center justify-center w-full min-h-[200px] text-center bg-background rounded-lg">
                <LottieAnimation
                  animationData={notFoundAnimation}
                  className="w-24 h-24"
                />
                <h3 className="text-base font-semibold text-foreground">
                  Nenhum imóvel encontrado
                </h3>
                <p className="text-sm text-muted-foreground">
                  Parece que não há imóveis disponíveis nesta categoria.
                </p>
                {viewAllLink && (
                  <Link href={viewAllLink}>
                    <CustomButton className="mt-4">
                      Ver todos os imóveis
                    </CustomButton>
                  </Link>
                )}
              </div>
            </CarouselItem>
          )}
        </CarouselContent>

        {properties.length > 0 && (
          <>
            <CarouselPrevious
              className={cn(
                "hidden absolute  top-1/2 -translate-y-1/12 z-10  lg:inline-flex",
                "-left-6 ",
                "bg-background text-foreground border border-muted shadow-md",
                "hover:bg-accent hover:text-accent-foreground"
              )}
            />
            <CarouselNext
              className={cn(
                "hidden absolute  top-1/2 -translate-y-1/12 z-10  lg:inline-flex",
                "-right-6 ",
                "bg-background text-foreground border border-muted shadow-md",
                "hover:bg-accent hover:text-accent-foreground"
              )}
            />
          </>
        )}
      </Carousel>
    </div>
  );
}
