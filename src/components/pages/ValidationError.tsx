import { type FieldError } from "react-hook-form";
import { AlertCircle } from "lucide-react";

type Props = {
  fieldError: FieldError | undefined;
};

export function ValidationError({ fieldError }: Props) {
  if (!fieldError) {
    return null;
  }
  return (
    <div role="alert" className="flex items-center gap-2 text-red-600 text-sm mt-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span className="font-medium">{fieldError.message}</span>
    </div>
  );
}
