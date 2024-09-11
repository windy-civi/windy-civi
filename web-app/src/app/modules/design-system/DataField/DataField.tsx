import type { FC } from "react";
import {
  FaAt,
  FaFacebook,
  FaGlobe,
  FaPhone,
  FaTwitter,
  FaWikipediaW,
  FaYoutube,
} from "react-icons/fa";

type Props = {
  type: string;
  id: string;
};

export const DataField: FC<Props> = ({ type, id }) => {
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

export default DataField;
