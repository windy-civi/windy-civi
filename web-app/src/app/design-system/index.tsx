import { CustomChicagoTag } from "@windy-civi/domain/constants";
import React, { ComponentType, useState } from "react";
import {
  FaAt,
  FaFacebook,
  FaGlobe,
  FaPhone,
  FaTwitter,
  FaWikipediaW,
  FaYoutube,
} from "react-icons/fa";
import { classNames } from "./styles";

// ==========================================
// Layout Components
// ==========================================

/**
 * A container component for grouping related content with a title and description
 * @param title - Optional title for the section
 * @param description - Optional description text
 * @param className - Optional CSS classes to apply
 * @param children - Child content to display
 */
export const Section: React.FC<{
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}> = ({ title, children, className, description }) => {
  return (
    <section>
      <div className="mb-2">
        {title && <SectionTitle>{title}</SectionTitle>}
        <Annotation>{description}</Annotation>
      </div>

      <div className={className}>{children}</div>
      <Divider className="my-4" />
    </section>
  );
};

/**
 * A styled title component for section headers
 */
export const SectionTitle: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  return (
    <div className="font-serif">
      <span
        className={classNames("rounded-sm font-bold text-white", "lg:text-xl")}
      >
        {props.children}
      </span>
    </div>
  );
};

/**
 * A full-screen container component with a title and styled content area
 * @param title - The title to display at the top of the screen
 * @param children - Child content to display in the styled container
 */
export const CustomScreen: React.FC<{
  children: React.ReactNode;
  title: string;
}> = ({ children, title }) => {
  return (
    <main className="mb-4">
      <div className="my-2 font-serif text-2xl font-semibold leading-tight text-white lg:text-left">
        {title}
      </div>
      <div
        className={classNames(
          "flex justify-center p-4",
          "rounded-lg shadow-lg",
        )}
        style={{ backdropFilter: "blur(10px) brightness(0.7)" }}
      >
        {children}
      </div>
    </main>
  );
};

/**
 * Grid layout component that stacks vertically on mobile and shows a 2-column layout on desktop
 */
export const Grid: ComponentType<{
  style?: React.CSSProperties;
  className?: React.HTMLAttributes<HTMLElement>["className"];
  children?: React.ReactNode;
}> = ({ children, style, className }) => (
  <section
    className={classNames(
      "grid grid-cols-1 lg:grid-cols-[minmax(300px,_500px)_1fr]",
      className,
    )}
    style={style}
  >
    {children}
  </section>
);

/**
 * Modal component for displaying content in an overlay
 */
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

// ==========================================
// Form Components
// ==========================================

export const Button: React.FC<{
  onClick?: () => void;
  className?: string;
  type?: "default" | "call-to-action" | "submit";
  children: React.ReactNode;
}> = ({ onClick, children, className, type }) => {
  let typeClass = "";
  switch (type) {
    case "call-to-action":
      typeClass = "bg-green-600 hover:bg-green-700";
      break;
    case "default":
    default:
      typeClass = "bg-black bg-opacity-40 hover:bg-opacity-100";
      break;
  }

  return (
    <button
      role="button"
      type={type === "submit" ? "submit" : "button"}
      className={classNames(
        "rounded px-4 py-2 text-base font-semibold text-white",
        typeClass,
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// ==========================================
// Atomic Components
// ==========================================

export const Annotation: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  return (
    <div className="text-sm text-white text-opacity-90 italic">
      {props.children}
    </div>
  );
};

// ==========================================
// Special Components
// ==========================================

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
 * Carousel Component for displaying content in a slideshow format
 */
export const Carousel = ({
  data,
}: {
  data: { title: string; content: React.ReactNode }[];
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<null | number>(null);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
  };

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

    if (difference > 5) {
      nextSlide();
    }

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

/**
 * RadioPicker component for selecting options
 */
type OptionLocation = "first" | "last" | "middle";
interface Option<T> {
  label: string;
  value: T;
  className?: (isSelected: boolean, location: OptionLocation) => string;
}

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

export const RadioPicker = <T extends string>({
  options,
  handleChange,
  defaultValue,
  type,
  highlighted,
  optionClassName,
  containerClassName,
}: {
  options: Option<T>[];
  handleChange: (s: T) => void;
  defaultValue: T;
  type?: "transparent";
  highlighted?: T[];
  optionClassName?: string | false | null;
  containerClassName?: string | false | null;
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
      {options.map((option, i) => {
        const isSelected = option.value === selectedOption;
        // Allowing multiple items to be highlighted for locales
        const alsoHighlighted = highlighted?.includes(option.value) || false;
        const isHighlighted = isSelected || alsoHighlighted;

        const indexInGroup =
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
              getRadioStyle(type || "solid", isHighlighted, indexInGroup),
              option.className?.(isHighlighted, indexInGroup),
            )}
          >
            {option.label}
          </div>
        );
      })}
    </div>
  );
};

/**
 * Tag components for displaying and managing tags
 */

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
            selectedTags.includes(tag)
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
