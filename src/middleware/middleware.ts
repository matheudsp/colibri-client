import { NextRequest, NextResponse } from "next/server";

export const publicRoutes = [
  "/",
  "/verificar-email",
  "/esqueci-senha",
  "/redefinir-senha",
  "/entrar",
  "/registrar",
  /^\/imoveis\/[^/]+$/,
  /^\/imovel\/[^/]+$/, // Corresponde a /imovel/{qualquer-id}
  "/ajuda",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("accessToken")?.value;

  const isPublicRoute = publicRoutes.some((route) => {
    if (route instanceof RegExp) {
      return route.test(pathname);
    }
    return pathname === route;
  });

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL("/entrar", req.url);
    loginUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
