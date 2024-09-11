import { useState } from "react";
import {
  CustomChicagoTag,
  SPONSORED_BY_REP_TAG,
} from "~app/modules/data/filters";
import { classNames } from "../styles";

export const Tag: React.FC<{
  type?: "tiny";
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
