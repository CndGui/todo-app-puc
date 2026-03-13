type Variant = "primary" | "secondary" | "ghost" | "soft" | "danger";
type Size = "md" | "sm";

const variantClasses: Record<Variant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  ghost: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
  soft: "bg-blue-50 text-blue-600 hover:bg-blue-100",
  danger: "text-red-400 hover:bg-red-50 hover:text-red-600",
};

const sizeClasses: Record<Size, string> = {
  md: "px-4 py-2 text-sm",
  sm: "px-2 py-1 text-xs",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded font-medium cursor-pointer transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
