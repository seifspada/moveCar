// app/agent/layout.tsx

import AdminLayoutWrapper from "@/components/admin-components/AdminLayoutWrapper";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminLayoutWrapper />
      {children}
    </>
  );
}