import React from "react";

import { SupportedLocale } from "@windy-civi/domain/constants";
import { getTagsBeingFiltered } from "@windy-civi/domain/filters/filters.utils";
import { Locales, UserPreferences } from "@windy-civi/domain/types";
import { RadioPicker, Section, Tag } from "../../design-system";

/**
 * A container for displaying location filter options and address lookup
 */
export const LocationPreferences = (props: {
  location: Locales;
  afterLocation?: React.ReactNode;
  onChange: (next: Locales) => void;
  onClear: () => void;
}) => {
  return (
    <Section
      title={<div>Sources</div>}
      description={
        <>
          Sources are synced to your device. For example, if you pick "Chicago",
          the app will sync data from Chicago, Illinois, and Federal sources.
        </>
      }
    >
      <div>
        <div className="flex-1 rounded-b-md">
          <RadioPicker
            handleChange={(next) => {
              props.onChange(next);
            }}
            containerClassName="justify-end flex flex-row gap-2"
            defaultValue={props.location}
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
            ]}
          />
        </div>
      </div>
    </Section>
  );
};

/**
 * Displays a list of active filter tags in a horizontal layout
 */
export const TagNavigation = (props: UserPreferences) => {
  const tagsToShow = getTagsBeingFiltered({
    tags: props.tags,
    availableTags: [], // todo: get available tags
  });
  return (
    <div className="flex">
      {tagsToShow.map((v) => {
        return <Tag className="inline-block" key={v} type="tiny" text={v} />;
      })}
    </div>
  );
};
