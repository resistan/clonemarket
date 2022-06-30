import { cls } from "../libs/client/utils";

interface ButtonProps {
  large?: boolean;
  text: string;
  loading?: boolean;
  disabled?: boolean;
  [key: string]: any;
}

export default function Button({
  large = false,
  onClick,
  text,
  disabled,
  loading = false,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      onClick={onClick}
      className={cls(
        "w-full  text-white px-4 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none",
        large ? "py-3 text-base" : "py-2 text-sm ",
        disabled ? "bg-gray-300" : "bg-orange-500 hover:bg-orange-600"
      )}
    >
      {loading ? "Loading..." : text}
      {loading === null ? text : null}
    </button>
  );
}
