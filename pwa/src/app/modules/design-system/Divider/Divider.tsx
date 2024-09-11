import { classNames } from "../styles";

type DividerProps = {
  className?: string;
  children?: React.ReactNode;
  type?: "black" | "white";
};

export const Divider: React.FC<DividerProps> = ({
  className,
  children,
  type,
}) => {
  if (!children) {
    return <HR className={className} type={type} />;
  }
  return (
    <div className="flex items-center gap-2">
      <HR className={className} type={type} />
      <div className="opacity-50">{children}</div>
      <HR className={className} type={type} />
    </div>
  );
};

const HR = ({ className, type }: DividerProps) => (
  <hr
    className={classNames(
      "flex-1",
      "border-dashed opacity-30",
      type === "white" ? "border-white" : "border-black",
      className
    )}
  />
);
