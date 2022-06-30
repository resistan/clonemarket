import { cls } from "@libs/client/utils";
import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  label: string;
  name: string;
  kind?: "text" | "phone" | "price";
  register: UseFormRegisterReturn;
  type: string;
  required: boolean;
  disabled?: boolean;
  [key: string]: any;
}

export default function Input({
  label,
  name,
  type,
  required,
  kind = "text",
  register,
  disabled,
  ...rest
}: InputProps) {
  const defaultClasses =
    "appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500";
  return (
    <div>
      <label
        className="mb-1 block text-sm font-medium text-gray-700"
        htmlFor={name}
      >
        {label}
      </label>
      {kind === "text" ? (
        <div className="rounded-md relative flex  items-center shadow-sm">
          <input
            id={name}
            type={type}
            required={required}
            disabled={disabled}
            {...register}
            {...rest}
            className={cls(defaultClasses, disabled ? "bg-gray-200" : "")}
          />
        </div>
      ) : null}
      {kind === "price" ? (
        <div className="rounded-md relative flex  items-center shadow-sm">
          <div className="absolute left-0 pointer-events-none pl-3 flex items-center justify-center">
            <span className="text-gray-500 text-sm">$</span>
          </div>
          <input
            id={name}
            type={type}
            required={required}
            disabled={disabled}
            {...register}
            {...rest}
            className={cls(defaultClasses, disabled ? "bg-gray-200" : "")}
          />
          <div className="absolute right-0 pointer-events-none pr-3 flex items-center">
            <span className="text-gray-500">KRW</span>
          </div>
        </div>
      ) : null}
      {kind === "phone" ? (
        <div className="flex rounded-md shadow-sm">
          <span className="flex items-center justify-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 select-none text-sm">
            +82
          </span>
          <input
            id={name}
            type={type}
            required={required}
            disabled={disabled}
            {...register}
            {...rest}
            className={cls(defaultClasses, disabled ? "bg-gray-200" : "")}
          />
        </div>
      ) : null}
    </div>
  );
}
