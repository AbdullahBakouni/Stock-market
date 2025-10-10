"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { createAlert, updateAlert } from "@/lib/actions/alert.actions";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import { StocksSelectField } from "@/components/StocksSelectField";
import {
  ALERTS_CONDITIONS,
  ALERTS_FREQUENCY,
  ALERTS_TYPES,
} from "@/lib/constants";
import { useUserStore } from "@/lib/store/user-store";

interface AlertFormProps {
  initialData?: AlertFormData | null;
  alertId?: string | null;
}

export function AlertForm({ initialData, alertId }: AlertFormProps) {
  const searchParams = useSearchParams();
  const session = useUserStore((state) => state.session);
  const router = useRouter();
  const isEditing = Boolean(alertId);
  const stockSymbol = searchParams.get("symbol") || "";
  const form = useForm<AlertFormData>({
    defaultValues: initialData ?? {
      alertName: "",
      stockIdentifier: stockSymbol ? stockSymbol : "",
      threshold: 0,
      alertType: "price",
      conditionType: "greater",
      frequencyType: "once-per-hour",
      status: "pending",
    },
  });

  const { handleSubmit, register, control, formState } = form;
  const { errors, isSubmitting } = formState;

  const onSubmit = async (data: AlertFormData) => {
    try {
      const result = isEditing
        ? await updateAlert(alertId!, data)
        : await createAlert(data, session?.user?.id);

      if (result.success) {
        toast.success(isEditing ? "Alert updated ✅" : "Alert created ✅", {
          description: result.message,
        });
        router.push("/watchlist");
      } else {
        toast.error(result.message || "Failed to save alert");
      }
    } catch (e) {
      toast.error("Error saving alert");
      console.error(e);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <InputField
        name="alertName"
        label="Alert Name"
        placeholder="Apple at Discount!"
        register={register}
        error={errors.alertName}
        validation={{ required: "Alert Name is required", minLength: 2 }}
        isAlertForm
      />
      {stockSymbol ? (
        <InputField
          name="stockIdentifier"
          label=" Stock identifier"
          register={register}
          error={errors.stockIdentifier}
          validation={{
            required: "Stock identifier is required",
            minLength: 2,
          }}
          isAlertForm={true}
          disabled={stockSymbol ? true : false}
        />
      ) : (
        <StocksSelectField
          name="stockIdentifier"
          label="Stock identifier"
          control={control}
          error={errors.stockIdentifier}
          required
        />
      )}

      <SelectField
        name="alertType"
        label="Alert type"
        options={ALERTS_TYPES}
        control={control}
        error={errors.alertType}
        required
        isAlertForm={true}
      />

      <SelectField
        name="conditionType"
        label="Condition"
        options={ALERTS_CONDITIONS}
        control={control}
        error={errors.conditionType}
        required
        isAlertForm={true}
      />
      <InputField
        name="threshold"
        type="number"
        placeholder="eg: 140"
        step="0.01"
        label=" Threshold value"
        register={register}
        error={errors.threshold}
        validation={{
          required: "Threshold is required",
          min: {
            value: 10,
            message: "Threshold must be at least 10",
          },
        }}
        isAlertForm={true}
      />

      <SelectField
        name="frequencyType"
        label="Frequency"
        options={ALERTS_FREQUENCY}
        control={control}
        error={errors.conditionType}
        required
        isAlertForm={true}
      />
      <Button
        type="submit"
        className="alert-form-btn cursor-pointer"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? isEditing
            ? "Updating..."
            : "Creating..."
          : isEditing
            ? "Update Alert"
            : "Create Alert"}
      </Button>
    </form>
  );
}
