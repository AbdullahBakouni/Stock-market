"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import InputField from "@/components/InputField";
import { useForm } from "react-hook-form";
import SelectField from "@/components/SelectField";
import {
  ALERTS_CONDITIONS,
  ALERTS_FREQUENCY,
  ALERTS_TYPES,
} from "@/lib/constants";
import { toast } from "sonner";
import { createAlert } from "@/lib/actions/alert.actions";
import { useUserStore } from "@/lib/store/user-store";
import { StocksSelectField } from "@/components/StocksSelectField";

export default function NewAlertPage() {
  const session = useUserStore((state) => state.session);
  const searchParams = useSearchParams();
  const stockSymbol = searchParams.get("symbol") || "";
  // const stockName = searchParams.get("name") || "";
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AlertFormData>({
    defaultValues: {
      alertName: "",
      stockIdentifier: stockSymbol || "",
      threshold: 0,
      alertType: "price",
      conditionType: "greater",
      frequencyType: "once-per-hour",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: AlertFormData) => {
    try {
      const result = await createAlert(data, session?.user?.id);
      if (result.success) {
        toast.success("Create an alert", {
          description: result.message,
        });
        router.push("/watchlist");
      } else {
        toast.error("Creating Alert Field");
      }
    } catch (e) {
      console.error(e);
      toast.error("Creating Alert Field", {
        description:
          e instanceof Error ? e.message : "Failed to create an Alert.",
      });
    }
  };

  return (
    <div className="p-1 md:pt-1">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/watchlist"
          className="inline-flex items-center gap-2 text-[#FDD458] hover:text-[#FDD458]/90 mb-7 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Watchlist
        </Link>

        <div className="bg-[#141414] rounded-lg border-1 border-[#141414] shadow-xs shadow-[#0C0C0D0D] p-10">
          <h1 className="text-3xl font-bold mb-8 text-white">Price Alert</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <InputField
              name="alertName"
              label="Alert Name"
              placeholder="Apple at Discount!"
              register={register}
              error={errors.alertName}
              validation={{ required: "Alert Name is required", minLength: 2 }}
              isAlertForm={true}
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
              {isSubmitting ? "Creating Alert" : "Create Alert"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
