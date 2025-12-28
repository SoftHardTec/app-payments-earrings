"use client";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Toggle } from "@/components/ui/toggle";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

export interface payments {
  persona: string;
  amount: number;
  currency: string;
}

interface PaymentProps {
  Action: (payments: payments) => void;
  buttonAction: string;
  toastMessage: string;
  defaultValues?: payments;
}

const formSchema = z.object({
  persona: z
    .string()
    .min(5, "Debe tener 5 caracteres como mínimo.")
    .max(30, "Debe tener 30 caracteres como máximo."),
  amount: z
    .number("El monto es requerido")
    .min(2, "Debe tener mínimo 2 caracteres.")
    .max(1000000, "Debe tener máximo 7 caracteres."),
  currency: z.string().min(1, "Debe seleccionar una moneda"),
});

export default function PaymentSchedule({
  Action,
  buttonAction,
  toastMessage,
  defaultValues,
}: PaymentProps) {
  const [newPerson, setNewPerson] = useState<boolean>(false);
  const [isAmountFocused, setIsAmountFocused] = useState(false);
  const [personList, setPersonList] = useState<payments[]>([]);
  const router = useRouter();
  const form = useForm({
    defaultValues: defaultValues ?? {
      persona: "",
      amount: null as number | null,
      currency: null as string | null,
    },
    validators: { onChange: formSchema },
    onSubmit: async ({ value }) => {
      const { persona, amount, currency } = value;

      if (amount === null || currency === null) {
        return;
      }

      Action({ persona, amount, currency });

      toast.success(toastMessage, {
        position: "bottom-right",
        duration: 3000,
        className: "inline-block",
      });

      form.reset();
      router.push("/");
    },
  });

  useEffect(() => {
    const payments = localStorage.getItem("payments");
    if (payments) {
      const timer = setTimeout(() => {
        const personUnique = JSON.parse(payments).reduce(
          (acc: payments[], payment: payments) => {
            if (!acc.some((p) => p.persona === payment.persona)) {
              acc.push(payment);
            }
            return acc;
          },
          []
        );
        setPersonList(personUnique);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <CardContent className="px-8">
        <form
          id="bug-report-form"
          onSubmit={(a) => {
            a.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field name="persona">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Persona</FieldLabel>
                    <div className="flex gap-1">
                      {defaultValues || newPerson ? (
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          autoComplete="off"
                        />
                      ) : (
                        <Select
                          name={field.name}
                          value={field.state.value ?? ""}
                          onValueChange={(value) => field.handleChange(value)}
                        >
                          <SelectTrigger
                            id={field.name}
                            aria-invalid={isInvalid}
                            onBlur={field.handleBlur}
                            className="w-full"
                          >
                            <SelectValue placeholder="Seleccione una persona" />
                          </SelectTrigger>
                          <SelectContent className="">
                            {personList.length > 0 ? (
                              personList.map((p: payments, index: number) => (
                                <SelectItem key={index} value={p.persona}>
                                  <span>{p.persona}</span>
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none" disabled>
                                <span>No hay personas</span>
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      )}
                      {!defaultValues && (
                        <Toggle
                          size="sm"
                          onClick={() => {
                            setNewPerson(!newPerson);
                            form.reset();
                          }}
                        >
                          <Plus />
                        </Toggle>
                      )}
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <div className="flex gap-1">
              <form.Field name="amount">
                {(field) => {
                  const displayValue = isAmountFocused
                    ? field.state.value ?? ""
                    : field.state.value != null
                    ? field.state.value.toFixed(2)
                    : "";
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <Label htmlFor={field.name}>Monto</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={displayValue}
                        onFocus={() => setIsAmountFocused(true)}
                        onBlur={() => {
                          setIsAmountFocused(false);
                          field.handleBlur();
                        }}
                        type="number"
                        step="0.01"
                        onChange={(e) => {
                          const value = e.target.value;
                          field.handleChange(
                            value === "" ? null : Number(value)
                          );
                        }}
                        aria-invalid={isInvalid}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
              <form.Field name="currency">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="w-32">
                      <Label htmlFor={field.name}>Moneda</Label>
                      <Select
                        name={field.name}
                        value={field.state.value ?? ""}
                        onValueChange={(value) => field.handleChange(value)}
                      >
                        <SelectTrigger
                          id={field.name}
                          aria-invalid={isInvalid}
                          onBlur={field.handleBlur}
                        >
                          <SelectValue placeholder=" " />
                        </SelectTrigger>
                        <SelectContent className="">
                          <SelectItem value="$">
                            <span>USD</span>
                          </SelectItem>
                          <SelectItem value="Bss">
                            <span>Bss</span>
                          </SelectItem>
                          <SelectItem value="$-Z">
                            <span>Zelle</span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
      <Field orientation="horizontal" className="justify-center">
        <Button type="submit" form="bug-report-form">
          {buttonAction}
        </Button>
      </Field>
    </>
  );
}
