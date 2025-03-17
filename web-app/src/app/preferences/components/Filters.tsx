import React, { useState } from "react";

import { SupportedLocale } from "@windy-civi/domain/constants";
import {
  getTagsBeingFiltered,
  isAddressFilter,
  parseAvailableTags,
} from "@windy-civi/domain/filters/filters.utils";
import { getLegislators } from "@windy-civi/domain/representatives/representatives.utils";
import { FilterParams, LocationFilter } from "@windy-civi/domain/types";
import {
  AddressLookup,
  Button,
  Divider,
  RadioPicker,
  Tag,
  Tagging,
  classNames,
} from "../../design-system";
import { FeedFilterProps } from "../../feed/types";
import { LegislatorsInfo } from "./Representatives";

const LocationFilterContainer = (props: {
  location: LocationFilter;
  afterLocation: React.ReactNode;
  onChange: (next: LocationFilter) => void;
  onClear: () => void;
}) => {
  return (
    <FilterContainer
      title={<div>Location</div>}
      description={
        <div>
          Using an address allows you to see your elected officials and the
          bills they sponsor.
        </div>
      }
    >
      <div>
        <div
          className={classNames(
            "flex-1 rounded-md bg-black bg-opacity-30 shadow-md",
          )}
        >
          <AddressLookup
            onClear={() => props.onClear()}
            onPlaceSelected={(address) => {
              props.onChange({ address });
            }}
            value={
              isAddressFilter(props.location) ? props.location.address : ""
            }
          />
        </div>
        <Divider>or</Divider>
        <div className="flex-1 rounded-b-md">
          <div className="mb-1 text-center text-sm uppercase text-white opacity-90">
            Select a General Location
          </div>
          <RadioPicker
            handleChange={(next) => {
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

export const TagNavigation = (props: FeedFilterProps) => {
  const tagsToShow = getTagsBeingFiltered(props.filters);
  return (
    <div className="flex">
      {tagsToShow.map((v) => {
        return <Tag className="inline-block" key={v} type="tiny" text={v} />;
      })}
    </div>
  );
};

const FilterContainer: React.FC<{
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}> = ({ title, children, className, description }) => {
  return (
    <div className="mb-4">
      <div className="mb-2">
        {title && <FilterTitle>{title}</FilterTitle>}
        <div className="text-sm text-white" style={{ fontStyle: "italic" }}>
          {description}
        </div>
      </div>

      <div className={className}>{children}</div>
    </div>
  );
};

const FilterTitle: React.FC<{
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

export const BillFilters = (
  props: Pick<
    FeedFilterProps,
    "filters" | "updateFilters" | "saveToFeed" | "showAllReps" | "offices"
  > & {
    title: string;
  },
) => {
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
        className={classNames("opacity-80")}
        offices={props.offices}
        location={filterState.location}
        showAllReps={props.showAllReps}
      />
    </>
  );

  return (
    <section className="mb-4">
      <div className="my-2 font-serif text-2xl font-semibold leading-tight text-white lg:text-left">
        {props.title}
      </div>

      <div
        className={classNames(
          "flex justify-center p-4",
          "rounded-lg shadow-lg",
        )}
        style={{ backdropFilter: "blur(10px) brightness(0.7)" }}
      >
        <div
          className={classNames(
            "flex w-full max-w-screen-md flex-col justify-center",
          )}
        >
          {/* Location Filter */}
          <LocationFilterContainer
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
          <FilterContainer title="Notifications">
            <div></div>
          </FilterContainer>

          {/* Tags Filter */}
          {filterState.location && (
            <>
              <FilterContainer title="Interests">
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
                  Save Preferences
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
