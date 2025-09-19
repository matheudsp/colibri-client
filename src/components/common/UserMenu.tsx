import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { AuthService } from "@/services/domains/authService";
import { useUserStore } from "@/stores/userStore";

type UserMenuProps = {
  orientation?: "horizontal" | "vertical";
  isScrolled?: boolean;
  fullWidth?: boolean;
};

export function UserMenu({
  orientation = "horizontal",
  isScrolled = true,
  fullWidth,
}: UserMenuProps) {
  const { user, clearUser } = useUserStore();
  const router = useRouter();

  const handleLogout = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await AuthService.logout();
      clearUser();
      toast.success("Sessão encerrada com sucesso!");
      router.push("/entrar");
    } catch (error) {
      toast.error("Erro ao encerrar a sessão. Tente novamente.");
      console.error("Logout failed:", error);
    }
  };

  if (!user) {
    return null;
  }

  const userInitial = user.name.charAt(0).toUpperCase();

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          className={`group pr-2 inline-flex w-full items-center justify-between rounded-full text-sm font-medium focus:outline-none focus:ring-1  ${
            isScrolled ? "focus:ring-secondary" : "focus:ring-primary"
          }`}
        >
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold text-white ${
              isScrolled ? "bg-secondary" : "bg-primary"
            }`}
          >
            {userInitial}
          </span>
          {orientation === "horizontal" && (
            <>
              <span
                className={`ml-3 ${
                  !fullWidth && "hidden"
                } sm:block font-semibold transition-colors duration-300 ${
                  isScrolled ? "text-gray-700" : "text-white"
                }`}
              >
                {user.name}
              </span>
              <ChevronDownIcon
                className={`-mr-1 ml-1 h-5 w-5 transition-colors duration-300 ${
                  isScrolled
                    ? "text-gray-400 group-hover:text-gray-600"
                    : "text-white/70 group-hover:text-white"
                }`}
                aria-hidden="true"
              />
            </>
          )}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white shadow-lg border focus:outline-none">
          <div className="p-1">
            <div className="px-3 py-2">
              <p className="truncate text-sm font-semibold text-gray-900">
                {user.name}
              </p>
              <p className="truncate text-sm text-gray-500">{user.email}</p>
            </div>
            <div className="my-1 border-t border-gray-100" />
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/conta"
                  className={`${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  } group flex w-full items-center rounded-md px-3 py-2 text-sm`}
                >
                  <UserCircleIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  Minha Conta
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleLogout}
                  className={`${
                    active ? "bg-red-50 text-red-800" : "text-gray-700"
                  } group flex w-full items-center rounded-md px-3 py-2 text-sm`}
                >
                  <ArrowRightOnRectangleIcon
                    className={`mr-3 h-5 w-5 ${
                      active ? "text-red-500" : "text-gray-400"
                    } group-hover:text-red-500`}
                    aria-hidden="true"
                  />
                  Sair
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
