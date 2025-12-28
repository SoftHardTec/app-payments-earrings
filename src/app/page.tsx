"use client";

import { useEffect, useState } from "react";
import { payments } from "@/components/field/index";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Trash, RefreshCw } from "lucide-react";

function Page() {
  const [paymentsArray, setPaymentsArray] = useState<payments[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const storedPayments = localStorage.getItem("payments");
      if (storedPayments) {
        setPaymentsArray(JSON.parse(storedPayments));
      }
      setLoading(false);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleDelete = (index: number) => {
    const newPayments = [...paymentsArray];
    newPayments.splice(index, 1);
    setPaymentsArray(newPayments);
    localStorage.setItem("payments", JSON.stringify(newPayments));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full font-bold">
        Cargando...
      </div>
    );
  }

  const paymentTotalsByPerson = paymentsArray.reduce((acc, payment) => {
    const { persona, amount, currency } = payment;
    if (!acc[persona]) {
      acc[persona] = {};
    }
    if (!acc[persona][currency]) {
      acc[persona][currency] = 0;
    }
    acc[persona][currency] += amount;
    return acc;
  }, {} as Record<string, Record<string, number>>);

  const groupedPayments = paymentsArray.reduce((acc, payment, index) => {
    const person = payment.persona;
    if (!acc[person]) {
      acc[person] = [];
    }
    acc[person].push({ ...payment, originalIndex: index });
    return acc;
  }, {} as Record<string, (payments & { originalIndex: number })[]>);

  return (
    <div className="relative flex flex-col h-[calc(100vh-6rem)] w-screen mx-10 rounded-xl sm:w-125  ">
      <h1 className=" text-center text-3xl font-bold mt-10">
        Pagos Pendientes
      </h1>
      <div className="flex flex-col mt-6 h-screen">
        {paymentsArray.length > 0 ? (
          Object.entries(groupedPayments).map(([persona, personPayments]) => (
            <div
              key={persona}
              className="mb-6 border-2 border-dashed rounded-xl"
            >
              <h2 className="text-xl font-semibold text-center my-4">
                {persona}
              </h2>
              {personPayments.map((payment) => (
                <div
                  key={payment.originalIndex}
                  className="flex gap-5 mt-2 justify-between h-auto px-6 py-3 items-center mx-5 rounded-sm  "
                >
                  <h2 className="text-lg font-bold text-center">
                    {payment.amount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    {payment.currency}
                  </h2>
                  <div className="flex gap-4">
                    <Button
                      variant={"default"}
                      onClick={() => handleDelete(payment.originalIndex)}
                      className="bg-red-500 font-bold p-2 rounded-xl hover:bg-red-600"
                    >
                      <Trash size={20} color="white" />
                    </Button>
                    <Button
                      variant={"default"}
                      onClick={() =>
                        router.push(`/update/${payment.originalIndex}`)
                      }
                      className="font-bold bg-amber-500 p-2 rounded-xl hover:bg-amber-600 "
                    >
                      <RefreshCw size={20} color="white" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t-2 border-dashed mx-5">
                <h4 className="text-lg font-bold text-right mr-11 mb-2">
                  Totales:
                </h4>
                {paymentTotalsByPerson[persona] &&
                  Object.entries(paymentTotalsByPerson[persona]).map(
                    ([currency, total]) => (
                      <div
                        key={currency}
                        className="flex justify-end gap-2 items-center px-6"
                      >
                        <h4 className="text-lg font-bold mr-6 mb-2">
                          {total.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                          {currency}
                        </h4>
                      </div>
                    )
                  )}
              </div>
            </div>
          ))
        ) : (
          <h1 className=" flex h-full w-full justify-center items-center text-2xl font-bold">
            No hay pagos
          </h1>
        )}
      </div>
    </div>
  );
}

export default Page;
