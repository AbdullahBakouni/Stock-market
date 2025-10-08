import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const InputField = ({
  name,
  label,
  placeholder,
  type = "text",
  register,
  error,
  validation,
  disabled,
  value,
  isAlertForm,
  step,
}: FormInputProps) => {
  return (
    <div className={cn(isAlertForm ? "" : "space-y-2")}>
      <Label
        htmlFor={name}
        className={cn(isAlertForm ? "alert-form-label" : "form-label")}
      >
        {label}
      </Label>
      {step ? (
        <div className="relative">
          <span className="dollar-span">$</span>
          <Input
            type={type}
            id={name}
            step={step ? step : ""}
            placeholder={placeholder}
            value={value}
            className={cn(
              isAlertForm ? "alert-form-input" : "form-input",
              step
                ? " [appearance:textfield]  [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                : "",
              {
                "opacity-50 cursor-not-allowed": disabled,
              },
            )}
            {...register(name, validation)}
          />
        </div>
      ) : (
        <Input
          type={type}
          id={name}
          step={step ? step : ""}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          className={cn(isAlertForm ? "alert-form-input" : "form-input", {
            "opacity-50 cursor-not-allowed": disabled,
          })}
          {...register(name, validation)}
        />
      )}
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};
export default InputField;
