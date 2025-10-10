import { use } from "react";
import { getAlertByShortId } from "@/lib/actions/alert.actions";
import { AlertForm } from "@/components/AlertForm";
import { notFound } from "next/navigation";

interface PageProps {
  searchParams: { id?: string };
}

export default function NewAlertPage({ searchParams }: PageProps) {
  const { id } = searchParams;
  let alertData = null;

  if (id) {
    const data = use(getAlertByShortId(id)); // ✅ Server-side async call using use()
    if (!data?.success) notFound();
    alertData = data.alert;
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="bg-[#141414] rounded-lg border-1 border-[#141414] shadow-xs shadow-[#0C0C0D0D] p-10">
        <h1 className="text-3xl font-bold mb-6 text-white">
          {id ? "Edit Alert" : "Create New Alert"}
        </h1>
        <AlertForm initialData={alertData} alertId={id || null} />
      </div>
    </div>
  );
}
