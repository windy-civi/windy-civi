import React, { ComponentType, useState } from "react";
import Autocomplete from "react-google-autocomplete";
import { useAppContext } from "../app-shell/AppContext";
import { classNames, css, Skin, Spacing, Style } from "./styles";
import {
  FaAt,
  FaFacebook,
  FaGlobe,
  FaPhone,
  FaTwitter,
  FaWikipediaW,
  FaYoutube,
} from "react-icons/fa";

/**
 * Address Lookup Component
 */

export const AddressLookup: ComponentType<{
  onPlaceSelected: (address: string) => void;
  onClear: () => void;
  value?: string;
}> = ({ value, onPlaceSelected, onClear }) => {
  const config = useAppContext();
  return config?.GOOGLE_API_KEY ? (
    <div className="flex items-center p-2 lg:text-right">
      <div>🏠</div>
      <Autocomplete
        // Hack to force remount
        key={value || ""}
        options={{ types: ["address"] }}
        apiKey={config.GOOGLE_API_KEY}
        placeholder="Enter Address..."
        defaultValue={value}
        className="w-full rounded-md bg-transparent px-2 text-white outline-none lg:text-right lg:text-lg"
        onPlaceSelected={({ formatted_address }) => {
          if (formatted_address) {
            onPlaceSelected(formatted_address);
          }
        }}
      />
      {value && (
        <button
          style={{ width: "27px", height: "25px" }}
          className="mx-1 rounded-full bg-black bg-opacity-40 text-xs text-white opacity-60 hover:opacity-100"
          onClick={() => {
            onClear();
          }}
        >
          X
        </button>
      )}
    </div>
  ) : (
    <input
      disabled
      value={value}
      placeholder="Loading..."
      className="w-full rounded-md bg-transparent px-2 py-1 lg:text-right"
    />
  );
};

export const Button: React.FC<{
  onClick: () => void;
  className?: string;
  type?: "default" | "call-to-action";
  children: React.ReactNode;
}> = ({ onClick, children, className, type }) => {
  let typeClass = "";
  switch (type) {
    case "call-to-action":
      typeClass = "bg-green-500 hover:bg-green-700";
      break;
    case "default":
    default:
      typeClass = "bg-black bg-opacity-40 hover:bg-opacity-100";
      break;
  }

  return (
    <div
      role="button"
      className={classNames(
        "rounded px-4 py-2 text-base font-semibold text-white",
        typeClass,
        className,
      )}
      onClick={() => {
        onClick();
      }}
    >
      {children}
    </div>
  );
};

/**
 * Card Component
 */

interface StyleComponent {
  style?: Style.Properties;
  children?: React.ReactNode;
}

type FC = {
  children?: React.ReactNode;
};

export const Card: React.FC<StyleComponent> = ({ children, style }) => (
  <div {...css({ ...styles.card, ...(style || {}) })}>{children}</div>
);

export const CardSection = ({ children }: FC) => (
  <section style={{ margin: Spacing.FOUR, fontSize: "0.9rem" }}>
    {children}
  </section>
);

export const CardTitle = ({ children }: FC) => (
  <h2
    style={{
      fontWeight: "bold",
      padding: Spacing.ZERO,
      marginTop: Spacing.TWO,
      marginBottom: Spacing.TWO,
      fontSize: "1.2rem",
      textAlign: "left",
    }}
  >
    {children}
  </h2>
);

const styles: Style.StyleSheet<"card"> = {
  card: {
    padding: Spacing.FOUR,
    marginTop: Spacing.FOUR,
    marginBottom: Spacing.FOUR,
    background: Skin.White,
    textAlign: "left",
  },
};

/**
 * Carousel Component
 */

export const Carousel = ({
  data,
}: {
  data: { title: string; content: React.ReactNode }[];
}) => {
  const [currentIndex, setCurrentIndex] = useState(0); // State to manage current index
  const [touchStartX, setTouchStartX] = useState<null | number>(null); // State to store initial touch position

  // Function to handle next button click
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
  };

  // Function to handle previous button click
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
  };

  // Touch swipe event handlers
  const handleTouchStart = (currentX: number) => {
    if (data.length < 2) {
      return;
    }
    setTouchStartX(currentX);
  };

  const handleTouchMove = (currentX: number) => {
    if (data.length < 2) {
      return;
    }
    if (touchStartX === null) {
      return;
    }
    const difference = touchStartX - currentX;

    // Swipe left
    if (difference > 5) {
      nextSlide();
    }

    // Swipe right
    if (difference < -5) {
      prevSlide();
    }

    setTouchStartX(null);
  };

  return (
    <div className="container mx-auto rounded-2xl border border-gray-200 bg-gray-100 p-4 px-4 ">
      <div className="relative">
        <div
          className={classNames(
            "mb-4 flex items-center",
            data.length > 1 ? "justify-between" : "justify-center",
          )}
        >
          {data.length > 1 && (
            <button
              onClick={prevSlide}
              className="select-none text-black focus:outline-none"
            >
              {"<"}
            </button>
          )}
          <div className="select-none text-sm font-bold">
            {data[currentIndex].title}
          </div>
          {data.length > 1 && (
            <button
              onClick={nextSlide}
              className="select-none text-black focus:outline-none"
            >
              {">"}
            </button>
          )}
        </div>
        <div
          onTouchStart={(e) => {
            handleTouchStart(e.touches[0].clientX);
          }}
          onTouchMove={(e) => {
            handleTouchMove(e.touches[0].clientX);
          }}
          onTouchEnd={() => setTouchStartX(null)}
        >
          {data[currentIndex].content}
        </div>
      </div>
    </div>
  );
};

type DataFieldProps = {
  type: string;
  id: string;
};

export const DataField: ComponentType<DataFieldProps> = ({ type, id }) => {
  switch (type) {
    case "Facebook":
      return (
        <a target="_blank" href={`https://facebook.com/${id}`} rel="noreferrer">
          <FaFacebook />
        </a>
      );
    case "Twitter":
      return (
        <a target="_blank" href={`https://twitter.com/${id}`} rel="noreferrer">
          <FaTwitter />
        </a>
      );
    case "Email":
      return (
        <a target="_blank" href={`mailto:${id}`} rel="noreferrer">
          <FaAt />
        </a>
      );
    case "Phone":
      return (
        <a target="_blank" href={`tel:${id}`} rel="noreferrer">
          <FaPhone />
        </a>
      );
    case "URL":
      if (id.includes("wikipedia")) {
        return (
          <a target="_blank" href={id} rel="noreferrer">
            <FaWikipediaW />
          </a>
        );
      }
      return (
        <a target="_blank" href={id} rel="noreferrer">
          <FaGlobe />
        </a>
      );
    case "YouTube":
      return (
        <a target="_blank" href={`https://youtube.com/${id}`} rel="noreferrer">
          <FaYoutube />
        </a>
      );
    case "Text":
      return <span>{id} • </span>;
    default:
      return (
        <span>
          {type}: {id}
        </span>
      );
  }
};

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
      className,
    )}
  />
);

/**
 * Instructions
 */

export function Instructions() {
  return (
    <div className="grow p-6">
      <h2 className="text-xl font-bold">Find Your Representatives</h2>
      <p>Use this site to find information about your representatives.</p>
    </div>
  );
}

/**
 * Layout related components
 */

export const Grid: ComponentType<{
  style?: React.CSSProperties;
  className?: React.HTMLAttributes<HTMLElement>["className"];
  children?: React.ReactNode;
}> = ({ children, style, className }) => (
  <section
    /**
     * Grid layout that stacks vertically on mobile (1 column) and shows a
     * 2-column layout on desktop with:
     * - Left column: Min 300px, max 500px width
     * - Right column: Takes remaining space (1fr)
     */
    className={classNames(
      "grid grid-cols-1 lg:grid-cols-[minmax(300px,_500px)_1fr]",
      className,
    )}
    style={style}
  >
    {children}
  </section>
);

export const Modal: ComponentType<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  const handleClose = () => {
    onClose();
  };

  const modalClasses = `flex justify-center items-center ${
    isOpen ? "" : "hidden"
  }`;

  const backdropClasses = "inset-0 bg-gray-500 opacity-75";

  return (
    <div className={modalClasses}>
      <div className="modal-overlay" onClick={handleClose} />
      <div className="modal-container z-50 mx-auto w-11/12 overflow-y-auto rounded bg-white shadow-lg md:max-w-md">
        <div className="modal-content py-4 px-6 text-left">
          <div className="modal-header">
            <button className="modal-close" onClick={handleClose}>
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6 fill-current"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M14.348 14.849a1 1 0 0 1-1.414 0L10 11.414l-2.93 2.93a1 1 0 0 1-1.414 0l-.707-.707a1 1 0 0 1 0-1.414L7.586 10l-2.93-2.93a1 1 0 0 1 0-1.414l.707-.707a1 1 0 0 1 1.414 0L10 8.586l2.93-2.93a1 1 0 0 1 1.414 0l.707.707a1 1 0 0 1 0 1.414L12.414 10l2.93 2.93a1 1 0 0 1 0 1.414l-.707.707z" />
              </svg>
            </button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
      <div className={backdropClasses} />
    </div>
  );
};

/**
 * RadioPicker
 */

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

export const ResultCard: ComponentType<{
  title?: string;
  subtitle?: string;
  channels: React.ReactNode;
}> = ({ title, subtitle, channels }) => {
  return (
    <div className="flex select-text flex-col rounded-lg border border-solid border-gray-200 px-4 py-2">
      <div className="text-xl font-semibold">{title}</div>
      <div className="text-lg">{subtitle}</div>
      <ul className="mt-1 flex list-none flex-wrap items-center gap-x-2">
        {channels}
      </ul>
    </div>
  );
};

/**
 * Tags
 */

import {
  CustomChicagoTag,
  SPONSORED_BY_REP_TAG,
} from "@windy-civi/domain/constants";

export const Tag: React.FC<{
  type?: "tiny" | "icon";
  text: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}> = ({ type, text, className, style, onClick }) => {
  let icon: string;
  let background: string;
  switch (text) {
    case "Climate Change":
      icon = "🌍";
      background = "bg-green-500";
      break;
    case "Health Care":
      icon = "🏥";
      background = "bg-blue-500";
      break;
    case "Education":
      icon = "🎓";
      background = "bg-yellow-500";
      break;
    case "Economy":
      icon = "💰";
      background = "bg-purple-500";
      break;
    case "Civil Rights":
      icon = "👥";
      background = "bg-red-500";
      break;
    case "Public Safety":
      icon = "🚓";
      background = "bg-indigo-500";
      break;
    case "Foreign Policy":
      icon = "🌐";
      background = "bg-pink-500";
      break;
    case "Democracy":
      icon = "🗳";
      background = "bg-gray-500";
      break;
    case "Transit":
      icon = "🚇";
      background = "bg-orange-500";
      break;
    case "States Rights":
      icon = "🏛";
      background = "bg-teal-500";
      break;
    case "Abortion":
      icon = "👶";
      background = "bg-rose-500";
      break;
    case "Immigration":
      icon = "🛂";
      background = "bg-cyan-500";
      break;
    case CustomChicagoTag.Ordinance:
      icon = "🏙️";
      background = "bg-teal-500";
      break;
    case CustomChicagoTag.Resolution:
      icon = "📜";
      background = "bg-rose-500";
      break;
    case SPONSORED_BY_REP_TAG:
      icon = "👤";
      background = "bg-blue-600";
      break;
    case "Other":
    default:
      icon = "";
      background = "bg-gray-500";
  }
  if (type === "icon") {
    return <span className={classNames(className, background)}>{icon}</span>;
  }
  return (
    <span
      role={onClick ? "option" : "none"}
      onClick={() => onClick?.()}
      style={style}
      className={
        type === "tiny"
          ? classNames(
              className,
              "m-1 rounded-full px-3 text-xs",
              background,
              "bg-opacity-60",
            )
          : classNames(
              className,
              baseTag,
              "font-medium uppercase text-opacity-90",
              background,
              "text-white",
            )
      }
    >
      {text} {icon}
    </span>
  );
};

export const Tagging = ({
  tags,
  selected,
  handleClick,
}: {
  tags: string[];
  selected: string[] | null;
  handleClick: (updatedTags: string[]) => void;
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(selected ?? []);

  const handleTagClick = (tag: string) => {
    let updatedTags: string[] = [];
    if (selectedTags.includes(tag)) {
      updatedTags = selectedTags.filter((t) => t !== tag);
    } else {
      updatedTags = [...selectedTags, tag];
    }
    handleClick(updatedTags);
    setSelectedTags(updatedTags);
  };

  return (
    <div className="flex flex-wrap justify-center text-center">
      {tags.map((tag) => (
        <Tag
          text={tag}
          key={tag}
          onClick={() => handleTagClick(tag)}
          className={classNames(
            "cursor-pointer",
            selectedTags.includes(tag) || selectedTags.length === 0
              ? "bg-opacity-70"
              : "bg-opacity-20 opacity-70 grayscale",
          )}
        />
      ))}
    </div>
  );
};

const baseTag = "px-3 py-1 m-1 mr-0 rounded-full border-none text-center";

export * from "./Icons";
export * from "./styles";
