import type { FC } from "react";

type Props = {
  title?: string;
  subtitle?: string;
  channels: React.ReactNode;
};

export const ResultCard: FC<Props> = ({ title, subtitle, channels }) => {
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

export default ResultCard;
