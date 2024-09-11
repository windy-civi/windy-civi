import { useState } from "react";
import { classNames } from "../styles";

type OptionLocation = "first" | "last" | "middle";
interface Option<T> {
  label: string;
  value: T;
  className?: (isSelected: boolean, location: OptionLocation) => string;
}

// i === options.length - 1
//         selectedOption === option.value

// eslint-disable-next-line react-refresh/only-export-components
export const getRadioStyle = (
  type: "transparent" | "solid",
  isSelected: boolean,
  location?: OptionLocation,
) => {
  if (type === "transparent") {
    return classNames(
      "my-1 mx-0 inline-flex cursor-pointer py-2 px-4 text-white text-sm uppercase border-b-2 border-white border-solid",
      `${
        isSelected
          ? "opacity-100 border-opacity-50"
          : "opacity-70 border-opacity-0"
      }`,
    );
  } else {
    return classNames(
      "mx-0 inline-flex cursor-pointer py-2 px-4 text-white",
      location === "first"
        ? "rounded-l-lg"
        : location === "last"
          ? "rounded-r-lg"
          : "",
      `${isSelected ? "bg-black bg-opacity-50" : "bg-black bg-opacity-20"}`,
    );
  }
};

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const RadioPicker = <T extends unknown>({
  options,
  handleChange,
  defaultValue,
  type,
  optionClassName,
  containerClassName,
  before,
}: {
  options: Option<T>[];
  handleChange: (s: T) => void;
  defaultValue: T;
  type?: "transparent";
  optionClassName?: string | false | null;
  containerClassName?: string | false | null;
  before?: React.ReactNode;
}) => {
  const [selectedOption, setSelectedOption] = useState<T>(defaultValue);

  const handleOptionChange = (newVal: T) => {
    handleChange(newVal);
    setSelectedOption(newVal);
  };

  return (
    <div
      role="radiogroup"
      aria-label="Filter By City, State, or National Bills"
      className={
        containerClassName || "flex flex-row justify-center lg:justify-end"
      }
    >
      {before}
      {options.map((option, i) => {
        const isSelected = option.value === selectedOption;
        const location =
          i === 0 ? "first" : i === options.length - 1 ? "last" : "middle";

        return (
          <div
            key={String(option.value)}
            role="radio"
            tabIndex={0}
            aria-checked={defaultValue === option.value}
            onClick={() => handleOptionChange(option.value as T)}
            className={classNames(
              optionClassName,
              getRadioStyle(type || "solid", isSelected, location),
              option.className?.(isSelected, location),
            )}
          >
            {option.label}
          </div>
        );
      })}
    </div>
  );
};
