/* tslint:disable */
import { type FC } from "react";
import Autocomplete from "react-google-autocomplete";
import { useAppContext } from "~app/modules/app-shell/AppContext";

export const AddressLookup: FC<{
  onPlaceSelected: (address: string) => void;
  onClear: () => void;
  value?: string;
}> = ({ value, onPlaceSelected, onClear }) => {
  const config = useAppContext();
  console.log({ config });
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
