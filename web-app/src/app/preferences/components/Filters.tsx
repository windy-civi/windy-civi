import React, { useState } from "react";

import {
  LocaleMap,
  Locales,
  SupportedLocale,
} from "@windy-civi/domain/locales";
import { UserPreferences } from "@windy-civi/domain/user-preferences";
import { RadioPicker, Section, Tag } from "../../design-system";
import { getTagsBeingFiltered } from "@windy-civi/domain/tags";

/**
 * A container for displaying location filter options and address lookup
 */
export const LocationPreferences = (props: {
  location: Locales;
  afterLocation?: React.ReactNode;
  onChange: (next: Locales) => void;
  onClear: () => void;
}) => {
  // highlight the locales that are supported by the selected locale
  const [highlighted, setHighlighted] = useState(LocaleMap[props.location]);

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
              setHighlighted(LocaleMap[next]);
            }}
            highlighted={highlighted}
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
