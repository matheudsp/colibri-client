import React, { Fragment, useState } from "react";
import { Menu, Transition, Dialog } from "@headlessui/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  UserCircleIcon,
  ExclamationTriangleIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { AuthService } from "@/services/domains/authService";
import { useUserStore } from "@/stores/userStore";
import { Settings, Shield } from "lucide-react";

type UserMenuProps = {
  orientation?: "horizontal" | "vertical";
  isScrolled?: boolean;
  fullWidth?: boolean;
};

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

function Avatar({
  name,
  image,
  isScrolled,
}: {
  name?: string;
  image?: string | null;
  isScrolled: boolean;
}) {
  const initial = (name?.charAt(0) ?? "?").toUpperCase();
  return (
    <div
      className={cx(
        "flex h-9 w-9 items-center justify-center rounded-full text-lg font-semibold text-white shrink-0",
        isScrolled ? "bg-secondary" : "bg-primary"
      )}
      aria-hidden
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={name || "Avatar"}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
}

export function UserMenu({
  orientation = "horizontal",
  isScrolled = true,
  fullWidth,
}: UserMenuProps) {
  const { user, clearUser } = useUserStore();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);

  if (!user) return null;

  const handleConfirmLogout = async () => {
    setLoadingLogout(true);
    try {
      await AuthService.logout();
      clearUser();
      toast.success("Sessão encerrada com sucesso!");
      router.push("/entrar");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao encerrar a sessão. Tente novamente.");
    } finally {
      setLoadingLogout(false);
      setShowLogoutConfirm(false);
    }
  };

  const showName = fullWidth ?? true;

  return (
    <div className="relative inline-block text-left">
      <Menu as="div" className="relative">
        <div>
          <Menu.Button
            className={cx(
              "group inline-flex items-center  w-full justify-between gap-3 rounded-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-offset-2 transition",
              isScrolled ? "focus:ring-secondary" : "focus:ring-primary"
            )}
            aria-label={`Abrir menu do usuário ${user.name}`}
          >
            <Avatar name={user.name} isScrolled={isScrolled} />

            {orientation === "horizontal" && (
              <>
                <div className="flex flex-col leading-tight">
                  <span
                    className={cx(
                      "text-sm font-semibold truncate max-w-[10rem]",
                      isScrolled ? "text-gray-700" : "text-white"
                    )}
                  >
                    {showName ? user.name : null}
                  </span>
                  <span className="text-xs text-gray-400 hidden sm:block truncate max-w-[10rem]">
                    {user.email}
                  </span>
                </div>

                <ChevronDownIcon
                  className={cx(
                    "ml-1 h-5 w-5 transition-colors duration-200",
                    isScrolled
                      ? "text-gray-400 group-hover:text-gray-600"
                      : "text-white/80 group-hover:text-white"
                  )}
                  aria-hidden
                />
              </>
            )}
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-150"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-100"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-50 mt-2 w-72 origin-top-right divide-y divide-border rounded-lg bg-background shadow-lg  ring-opacity-5 focus:outline-none border border-border">
            <div className="px-4 py-3">
              <div className="flex items-center gap-3">
                <Avatar name={user.name} isScrolled={isScrolled} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>

              {/* optional status / quick actions */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  href="/conta"
                  className="inline-flex items-center justify-center rounded-md border border-border px-2 py-1 text-sm font-medium text-gray-700 hover:bg-background/60"
                >
                  <UserCircleIcon
                    className="mr-2 h-4 w-4 text-gray-400"
                    aria-hidden
                  />
                  Perfil
                </Link>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="inline-flex items-center justify-center rounded-md bg-red-50 px-2 py-1 text-sm font-medium text-red-700 hover:bg-red-100"
                >
                  <ArrowRightOnRectangleIcon
                    className="mr-2 h-4 w-4 text-red-500"
                    aria-hidden
                  />
                  Sair
                </button>
              </div>
            </div>

            <div className="px-2 py-2">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/conta/seguranca"
                    className={cx(
                      "flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm",
                      active
                        ? "bg-background/70 text-gray-900"
                        : "text-gray-700"
                    )}
                  >
                    <Shield className="h-5 w-5 text-gray-400" aria-hidden />
                    Segurança
                  </Link>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/conta/configuracoes"
                    className={cx(
                      "flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm",
                      active
                        ? "bg-background/70 text-gray-900"
                        : "text-gray-700"
                    )}
                  >
                    <Settings
                      className="h-5 w-5 text-gray-400 rotate-90"
                      aria-hidden
                    />
                    Configurações
                  </Link>
                )}
              </Menu.Item>
            </div>
            <div className="px-3 py-3">
              <p className="text-xs text-gray-500 text-center">
                Dica: revise suas configurações de segurança para manter sua
                conta protegida.
              </p>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      {/* Logout confirmation dialog (small, focused) */}
      <Transition appear show={showLogoutConfirm} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setShowLogoutConfirm(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-background p-6 text-left align-middle shadow-xl ring-1 ring-border">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold text-gray-900"
                      >
                        Encerrar sessão?
                      </Dialog.Title>
                      <div className="mt-1 text-sm text-gray-500">
                        Tem certeza que deseja sair agora? Você precisará fazer
                        login novamente para acessar sua conta.
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-background/60"
                      onClick={() => setShowLogoutConfirm(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                      onClick={handleConfirmLogout}
                      disabled={loadingLogout}
                    >
                      {loadingLogout ? (
                        <svg
                          className="h-4 w-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="white"
                            strokeWidth="4"
                            strokeOpacity="0.2"
                          ></circle>
                          <path
                            d="M4 12a8 8 0 018-8"
                            stroke="white"
                            strokeWidth="4"
                            strokeLinecap="round"
                          ></path>
                        </svg>
                      ) : (
                        <CheckIcon className="h-4 w-4" />
                      )}
                      Sair
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
