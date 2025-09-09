"use client";

export default function CreationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh w-full bg-background">
      <main className="w-full">{children}</main>
    </div>
  );
}
