import React, { useState } from "react";
import { Form } from "react-router-dom";

import { SupportedLocale } from "@windy-civi/domain/constants";
import {
  getTagsBeingFiltered,
  isAddressFilter,
  parseAvailableTags,
} from "@windy-civi/domain/filters/filters.utils";
import { getLegislators } from "@windy-civi/domain/representatives/representatives.utils";
import { FilterParams, LocationFilter } from "@windy-civi/domain/types";
import {
  Button,
  CustomScreen,
  Divider,
  RadioPicker,
  Section,
  Tag,
  Tagging,
  classNames,
} from "../../design-system";
import { FeedFilterProps } from "../../feed/types";
import { LegislatorsInfo } from "./Representatives";
import { FaBackspace } from "react-icons/fa";
import { AddressLookup } from "./AddressLookup";

/**
 * A container for displaying location filter options and address lookup
 */
const LocationFilterContainer = (props: {
  location: LocationFilter;
  afterLocation: React.ReactNode;
  onChange: (next: LocationFilter) => void;
  onClear: () => void;
}) => {
  return (
    <Section
      title={<div>Location</div>}
      description={
        props.location === SupportedLocale.Custom ? (
          <>
            Using a custom address allows you to see your elected officials. We
            use Google Civic Information API to get this information. Your
            address is not saved on any server.
          </>
        ) : (
          <>
            Location is used to get the right sources for data. For example, if
            you pick "Chicago", the app will sync data from Chicago, Illinois,
            and Federal sources.
          </>
        )
      }
    >
      <div>
        <div className="flex-1 rounded-b-md">
          {props.location !== SupportedLocale.Custom && (
            <RadioPicker
              handleChange={(next) => {
                props.onChange(next);
              }}
              containerClassName="justify-end flex flex-row gap-2"
              defaultValue={props.location as SupportedLocale}
              optionClassName="flex-1 w-max rounded shadow"
              options={[
                {
                  label: "USA",
                  value: SupportedLocale.USA,
                },
                {
                  label: "Illinois",
                  value: SupportedLocale.Illinois,
                },
                {
                  label: "Chicago",
                  value: SupportedLocale.Chicago,
                },
                {
                  label: "🏠 Custom",
                  value: SupportedLocale.Custom,
                },
              ]}
            />
          )}
        </div>

        {props.location === SupportedLocale.Custom && (
          <div className="flex flex-row gap-2">
            <div
              className={classNames(
                "flex-1 rounded-md bg-black bg-opacity-30 shadow-md",
              )}
            >
              <AddressLookup
                before={
                  <button
                    className="text-white opacity-60 hover:opacity-100"
                    onClick={() => props.onChange(SupportedLocale.USA)}
                  >
                    <FaBackspace />
                  </button>
                }
                onClear={() => props.onClear()}
                onPlaceSelected={(address) => {
                  props.onChange({ address });
                }}
                value={
                  isAddressFilter(props.location) ? props.location.address : ""
                }
              />
            </div>
          </div>
        )}
      </div>
    </Section>
  );
};

/**
 * Displays a list of active filter tags in a horizontal layout
 */
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

/**
 * A form component for managing bill filter preferences
 * @param filters - Current filter state
 * @param updateFilters - Function to update filter state
 * @param saveToFeed - Function to save preferences to feed
 * @param showAllReps - Whether to show all representatives
 * @param offices - List of representative offices
 * @param title - Title to display at the top of the screen
 */
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
    <CustomScreen title={props.title}>
      <Form
        method="post"
        className={classNames(
          "flex w-full max-w-screen-md flex-col justify-center",
        )}
      >
        {/* Hidden inputs to capture state */}
        <input
          type="hidden"
          name="location"
          value={JSON.stringify(filterState.location)}
        />
        <input type="hidden" name="tags" value={filterState.tags?.join(",")} />

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
        <Section
          title="Your Representatives"
          description={
            <div>
              Using a custom address allows you to see your elected officials
              and the bills they sponsor.
            </div>
          }
        >
          <div></div>
        </Section>
        <Section
          title="Notifications"
          description={
            <div>
              We create notifications based on your "For You feed", which is
              based on your interests and location. To get notifications,
              download the iOS App or the PWA on Android / Desktop.
            </div>
          }
        >
          <div></div>
        </Section>
        {/* Tags Filter */}
        {filterState.location && (
          <Section
            title="Issues"
            description={
              <>Pick up to 3. We use these to score and prioritize your feed.</>
            }
          >
            <Tagging
              tags={filterState.availableTags}
              selected={filterState.tags}
              handleClick={(updatedTags) => {
                updateFilters({
                  tags: updatedTags,
                });
              }}
            />
          </Section>
        )}

        <Section title="Theme">
          <div></div>
        </Section>
        {/* Save Button */}
        <div className="mt-4 flex w-full justify-center">
          <Button type="submit">Save Preferences</Button>
        </div>
      </Form>
    </CustomScreen>
  );
};
