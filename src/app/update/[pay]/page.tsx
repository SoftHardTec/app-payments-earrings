"use client";

import PaymentSchedule from "@/components/field/index";
import { payments } from "@/components/field/index";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const params = useParams();
  const pay = parseInt(params.pay as string);
  const [currentPayment, setCurrentPayment] = useState<payments | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      const listPayments = JSON.parse(localStorage.getItem("payments") || "[]");
      if (listPayments[pay]) {
        setCurrentPayment(listPayments[pay]);
      }
      setLoading(false);
    }, 0);
    return () => clearTimeout(t);
  }, [pay]);

  const Action = (items: payments) => {
    const { persona, amount, currency } = items;
    const listPayments = JSON.parse(localStorage.getItem("payments") || "[]");
    listPayments[pay] = { persona, amount, currency };
    localStorage.setItem("payments", JSON.stringify(listPayments));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full font-bold">
        Cargando...
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center ">
      <div className=" flex flex-col justify-center gap-10 py-10 w-full rounded-xl sm:w-95 shadow-[3px_3px_15px_var(--tw-shadow-color)] dark:shadow-gray-500/50 shadow-gray-900/50  ">
        <CardHeader>
          <CardTitle className="text-center text-2xl ">
            Actualizar Pago
          </CardTitle>
        </CardHeader>
        <PaymentSchedule
          Action={Action}
          defaultValues={currentPayment}
          buttonAction="Actualizar"
          toastMessage="Pago Actualizado"
        />
      </div>
    </div>
  );
}
