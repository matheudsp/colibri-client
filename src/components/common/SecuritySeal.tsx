import { RiShieldKeyholeFill } from "react-icons/ri";
interface Props {
  withBorder?: boolean;
  className?: string;
  withIcon?: boolean;
}
export const SecuritySeal = ({
  withBorder = false,
  className,
  withIcon = true,
}: Props) => {
  return (
    <div
      className={`max-w-xl flex items-center justify-center gap-2 rounded-lg  p-2 text-center ${
        withBorder && "bg-emerald-50/70 border border-emerald-200/80"
      } ${className}`}
    >
      {withIcon && (
        <RiShieldKeyholeFill size={20} className=" text-secondary shrink-0" />
      )}
      <p className="text-xs font-medium text-secondary">
        Segurança total: seus dados são protegidos com criptografia simétrica
        avançada.
      </p>
    </div>
  );
};
