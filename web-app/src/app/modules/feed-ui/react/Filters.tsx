import { useState } from "react";
import {
  FilterParams,
  LocationFilter,
  RepLevel,
  SupportedLocale,
  getAddress,
  getLocation,
  getLocationInformationText,
  getTagsBeingFiltered,
  isAddressFilter,
  isCityLevel,
  isStateLevel,
  parseAvailableTags,
} from "~app/modules/data/legislation";
import { getLegislators } from "~app/modules/data/representatives";
import {
  AddressLookup,
  Button,
  Divider,
  RadioPicker,
  Tag,
  Tagging,
  classNames,
} from "~app/modules/design-system";
import { RouteOption } from "../feed-ui.constants";
import { FeedFilterProps, FeedProps } from "../feed-ui.types";
import { LegislatorsInfo } from "./Representatives";

const LocationFilterContainer = (props: {
  location: LocationFilter;
  afterLocation: React.ReactNode;
  onChange: (next: LocationFilter) => void;
  onClear: Function;
  introMode: boolean;
}) => {
  const hasLocation = Boolean(props.location);
  const [isEditing, setIsEditing] = useState(!hasLocation);
  const [showCancel, setShowCancel] = useState(hasLocation);
  if (!isEditing) {
    return (
      <FilterContainer
        largeTitle={props.introMode}
        title={
          <div>
            Location (
            <span
              role="button"
              className="cursor-pointer underline"
              onClick={() => {
                setIsEditing(true);
                if (!showCancel) {
                  setShowCancel(true);
                }
              }}
            >
              Edit
            </span>
            )
          </div>
        }
      >
        <div className="px-2 text-white lg:text-right lg:text-xl">
          <div className="text-center font-bold lg:text-right">
            {getLocation(props.location)}
          </div>
          {props.afterLocation}
        </div>
      </FilterContainer>
    );
  }

  return (
    <FilterContainer
      largeTitle={props.introMode}
      title={
        <div>
          Location
          {showCancel && (
            <>
              {" "}
              (
              <span
                role="button"
                className="cursor-pointer underline"
                onClick={() => {
                  setIsEditing(false);
                }}
              >
                Cancel
              </span>
              )
            </>
          )}
        </div>
      }
    >
      <div>
        <div
          className={classNames(
            "flex-1 rounded-md bg-black bg-opacity-30 shadow-md"
          )}
        >
          <AddressLookup
            onClear={() => props.onClear()}
            onPlaceSelected={(address) => {
              setIsEditing(false);
              props.onChange({ address });
            }}
            value={
              isAddressFilter(props.location) ? props.location.address : ""
            }
          />
        </div>
        <div
          className="mt-2 text-center text-sm text-white opacity-60"
          style={{ fontStyle: "italic" }}
        >
          Using an address allows you to see your elected officials and the
          bills they sponsor.
        </div>
        <Divider>or</Divider>
        <div className="flex-1 rounded-b-md">
          <div className="mb-1 text-center text-sm uppercase text-white opacity-90">
            Select a General Location
          </div>
          <RadioPicker
            handleChange={(next) => {
              setIsEditing(false);
              props.onChange(next);
            }}
            containerClassName="justify-end flex flex-row gap-2"
            defaultValue={props.location}
            optionClassName="flex-1 w-max rounded shadow"
            options={[
              {
                label: "Chicago",
                value: SupportedLocale.Chicago,
              },
              {
                label: "Illinois",
                value: SupportedLocale.Illinois,
              },
              {
                label: "USA",
                value: SupportedLocale.USA,
              },
            ]}
          />
        </div>
      </div>{" "}
    </FilterContainer>
  );
};

export const LevelFilter = (props: FeedProps) => {
  const cityLabel = isCityLevel(props.filters.location) ? "Chicago" : "City";

  const stateLabel =
    isCityLevel(props.filters.location) || isStateLevel(props.filters.location)
      ? "Illinois"
      : "State";

  const nationalLabel = "USA";

  const levelOptions: { label: string; value: RepLevel | null }[] | null =
    isCityLevel(props.filters.location)
      ? [
          { label: "All", value: null },
          { label: cityLabel, value: RepLevel.City },
          { label: stateLabel, value: RepLevel.State },
          { label: nationalLabel, value: RepLevel.National },
        ]
      : isStateLevel(props.filters.location)
      ? [
          { label: "All", value: null },
          { label: stateLabel, value: RepLevel.State },
          { label: nationalLabel, value: RepLevel.National },
        ]
      : [{ label: nationalLabel, value: RepLevel.National }];
  return (
    <>
      {levelOptions && (
        <div className="mt-4">
          <div className="bg-black bg-opacity-20 text-center lg:px-1">
            <span className="text-xs font-bold uppercase text-white opacity-80">
              Showing Bills From The Following Legislators
            </span>
          </div>
          <RadioPicker<RepLevel | null | undefined | "">
            handleChange={(next) => {
              if (!next) {
                props.updateFilters({
                  level: null,
                });
              } else {
                props.updateFilters({
                  level: next,
                });
              }
            }}
            optionClassName="flex-1 my-0 rounded-bl-none rounded-br-none rounded-tr-none rounded-tl-none justify-center"
            defaultValue={props.filters.level}
            options={levelOptions}
          />
        </div>
      )}
    </>
  );
};

export const YourFilterSummary = (
  props: FeedFilterProps & { setIsExploring: (b: boolean) => void }
) => {
  const locationInfoText = getLocationInformationText(props.filters.location);
  const locationName = getLocation(props.filters.location);
  const address = getAddress(props.filters.location);
  const locationText = (
    <div className="mb-1 text-left font-serif text-sm lg:text-lg">
      {locationInfoText.locationName && (
        <div className="mb-1 inline lg:block lg:text-3xl">
          {locationInfoText.locationName}!{" "}
        </div>
      )}
      {/* If only 1 layer, "combining" messaging doesn't make sense. */}
      {locationInfoText.levelText === "National" ? (
        <>
          This feed is summarizing bills that impact the entire country in an an
          easy to digest way.
        </>
      ) : (
        <>
          <span className="opacity-80 ">This feed is combining </span>
          <span>{locationInfoText.levelText}</span>
          <span className="opacity-80"> bills into a unified experience.</span>
        </>
      )}
    </div>
  );

  const preferencesText = (
    <span>
      <span className="opacity-60">Preferences</span>
      <span className="opacity-50">
        {" "}
        (
        <span
          role="button"
          className="underline"
          onClick={() => {
            props.setIsExploring(true);
          }}
        >
          Edit
        </span>
        |
        <span
          role="button"
          className="underline"
          onClick={() => {
            const confirm = window.confirm(
              "Are you sure you want to reset everything? All preferences will be lost"
            );
            if (confirm) {
              props.deleteAllData();
            }
          }}
        >
          Reset
        </span>
        )
      </span>
    </span>
  );

  const tagsToShow = getTagsBeingFiltered(props.filters);

  return (
    <div className="bg-black bg-opacity-30 p-2 lg:mt-5 lg:rounded-lg lg:px-5 lg:py-3">
      <div className="text-center text-white lg:text-left">
        <div className="lg:text-right">{preferencesText}</div>
        <div className="hidden lg:block">
          {locationText}
          {address && (
            <>
              <Divider type="white" className="my-5" />
              <div className="text-lg">{address}</div>
            </>
          )}
        </div>
        <div className="text-base lg:hidden">
          {address ? address : `Location: ${locationName}`}
        </div>
        <LegislatorsInfo
          showAllReps={props.showAllReps}
          location={props.filters.location}
          offices={props.offices}
        />
        {/* Mobile Tags */}
        <div className="overflow-hidden font-sans lg:hidden lg:justify-end">
          <div className="my-1 overflow-x-scroll whitespace-nowrap">
            {tagsToShow.map((v) => {
              return (
                <Tag className="inline-block" key={v} type="tiny" text={v} />
              );
            })}
          </div>
        </div>
        {/* Desktop Tags */}
        <div className="hidden lg:block">
          <Divider type="white" className="my-5" />
          <div className="mb-1 text-base font-bold uppercase opacity-80">
            Following
          </div>
          <div className="my-1 flex flex-wrap justify-center font-sans">
            {tagsToShow.map((v) => {
              return (
                <Tag
                  key={v}
                  text={v}
                  className="bg-opacity-60 text-sm lg:text-base"
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterContainer: React.FC<{
  title?: React.ReactNode;
  largeTitle?: boolean;
  className?: string;
}> = ({ title, children, className, largeTitle }) => {
  return (
    <div className="mt-4">
      {title && <FilterTitle largeTitle={largeTitle}>{title}</FilterTitle>}
      <div className={className || "rounded-lg bg-black bg-opacity-30 p-2"}>
        {children}
      </div>
    </div>
  );
};

const FilterTitle: React.FC<{ largeTitle?: boolean }> = (props) => {
  return (
    <div className="lg:px-1 lg:text-right">
      <span
        className={classNames(
          "rounded-sm font-bold uppercase text-white opacity-70",
          props.largeTitle ? "text-md lg:text-lg" : "text-sm"
        )}
      >
        {props.children}
      </span>
    </div>
  );
};

export const BillFilters = (
  props: FeedFilterProps & {
    title: string;
  }
) => {
  const introMode = props.globalState.route === RouteOption.INTRO;
  const [filterState, setFilterState] = useState<FilterParams>(props.filters);

  const updateFilters = (next: Partial<FilterParams>) => {
    props.updateFilters(next);
    if ("location" in next) {
      next.availableTags = parseAvailableTags(next.location);
    }
    setFilterState({ ...filterState, ...next });
  };

  const saveAsFeed = () => {
    props.saveToFeed(filterState);
  };

  const afterLocation = getLegislators(props.offices).length > 0 && (
    <>
      <Divider type="white" className="my-2 lg:my-3" />
      <LegislatorsInfo
        className={classNames("opacity-80", introMode && "text-center")}
        offices={props.offices}
        location={filterState.location}
        showAllReps={props.showAllReps}
      />
    </>
  );

  return (
    <section>
      <div className="mt-4 font-serif text-2xl font-semibold leading-tight text-white lg:text-left">
        {props.title}
      </div>

      <div className="flex justify-center">
        <div
          className={classNames(
            "flex w-full max-w-screen-md flex-col justify-center"
          )}
        >
          {/* Location Filter */}
          <LocationFilterContainer
            introMode={introMode}
            location={filterState.location}
            afterLocation={afterLocation}
            onChange={(next) => {
              updateFilters({
                location: next,
              });
            }}
            onClear={() => {
              updateFilters({
                location: null,
              });
            }}
          />
          {/* Tags Filter */}
          {filterState.location && (
            <>
              <FilterContainer title="Interests" largeTitle={introMode}>
                <Tagging
                  tags={filterState.availableTags}
                  selected={filterState.tags}
                  handleClick={(updatedTags) => {
                    updateFilters({
                      tags: updatedTags,
                    });
                  }}
                />
              </FilterContainer>
              {/* Save Button */}
              <div className="mt-4 flex w-full justify-center">
                <Button type="call-to-action" onClick={() => saveAsFeed()}>
                  {introMode ? "See Legislation" : "Save As Feed"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
