"use client";

import PaymentSchedule from "@/components/field/index";
import { payments } from "@/components/field/index";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

const Action = (payments: payments) => {
  const existingPayments = localStorage.getItem("payments");
  const paymentsList = existingPayments ? JSON.parse(existingPayments) : [];

  paymentsList.push(payments);

  localStorage.setItem("payments", JSON.stringify(paymentsList));
};

export default function Page() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full font-bold">
        Cargando...
      </div>
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center mx-10">
      <div className=" flex flex-col justify-center gap-10 w-full rounded-xl py-10 sm:w-[40vw] shadow-[3px_3px_15px_var(--tw-shadow-color)] dark:shadow-gray-500/50 shadow-gray-900/50  ">
        <CardHeader>
          <CardTitle className="text-center text-2xl ">
            Agregar Pago Pendiente
          </CardTitle>
        </CardHeader>
        <PaymentSchedule
          Action={Action}
          buttonAction="Guardar"
          toastMessage="Pago Pendiente Agregado"
        />
      </div>
    </div>
  );
}
