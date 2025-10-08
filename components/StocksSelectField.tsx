"use client";
import { Label } from "./ui/label";
import { useState } from "react";
import { Controller } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { POPULAR_STOCK_SYMBOLS } from "@/lib/constants";

// ✅ Component to render stock selector
const StocksSelect = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="stock-select-trigger"
        >
          {value ? (
            <span className="flex items-center gap-2">
              <span className="font-semibold">{value}</span>
            </span>
          ) : (
            "Select a stock symbol..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-full p-0 bg-[#141414] border-gray-600"
        align="start"
      >
        <Command className="bg-gray-800 border-gray-600">
          <CommandInput
            placeholder="Search stocks..."
            className="stock-select-input"
          />
          <CommandEmpty className="country-select-empty">
            No stock found.
          </CommandEmpty>
          <CommandList className="max-h-60 bg-gray-800 scrollbar-hide-default">
            <CommandGroup className="bg-gray-800">
              {POPULAR_STOCK_SYMBOLS.map((symbol) => (
                <CommandItem
                  key={symbol}
                  value={symbol}
                  onSelect={() => {
                    onChange(symbol);
                    setOpen(false);
                  }}
                  className="country-select-item"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 text-yellow-500",
                      value === symbol ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="font-medium">{symbol}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

// ✅ Field for React Hook Form integration
export const StocksSelectField = ({
  name,
  label,
  control,
  error,
  required = false,
}: StocksSelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>

      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `Please select ${label.toLowerCase()}` : false,
        }}
        render={({ field }) => (
          <StocksSelect value={field.value} onChange={field.onChange} />
        )}
      />

      {error && <p className="text-sm text-red-500">{error.message}</p>}

      <p className="text-xs text-gray-500">
        Choose a stock symbol to create an alert for.
      </p>
    </div>
  );
};
