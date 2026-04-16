import type { Metadata } from "next";
import AdminDashboard from "./AdminDashboard";
import AuthGuard from "@/components/AuthGuard";

export const metadata: Metadata = {
  title: "Panel Admin | Inmobiliaria & Seguros",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <AuthGuard>
      <AdminDashboard />
    </AuthGuard>
  );
}
