import { Form, useLoaderData } from "react-router-dom";
import {
  Button,
  CustomScreen,
  RadioPicker,
  Section,
  Tagging,
} from "../design-system";
import { useState } from "react";
import { UserPreferencesLoaderData } from "./types";
import { UserPreferences } from "@windy-civi/domain/user-preferences";
import { classNames } from "../design-system/styles";
import {
  LocaleMap,
  Locales,
  SupportedLocale,
} from "@windy-civi/domain/locales";
import { getFlagIcon } from "@windy-civi/domain/locales/flags";

const LocationOption = ({ locale }: { locale: SupportedLocale }) => {
  const flagSrc = getFlagIcon(locale);
  return (
    <div className="flex items-center gap-2 uppercase font-bold">
      <img
        src={flagSrc}
        alt={`${locale} flag`}
        className="w-5 h-3 object-cover"
      />
      {locale}
    </div>
  );
};

/**
 * A container for displaying location filter options and address lookup
 */
const LocationPreferences = (props: {
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
            containerClassName="justify-end flex flex-row"
            defaultValue={props.location}
            optionClassName="flex-1 w-max shadow"
            options={[
              {
                label: <LocationOption locale={SupportedLocale.USA} />,
                value: SupportedLocale.USA,
              },
              {
                label: <LocationOption locale={SupportedLocale.Illinois} />,
                value: SupportedLocale.Illinois,
              },
              {
                label: <LocationOption locale={SupportedLocale.Chicago} />,
                value: SupportedLocale.Chicago,
              },
            ]}
          />
        </div>
      </div>
    </Section>
  );
};

export function Preferences() {
  const data = useLoaderData() as UserPreferencesLoaderData;
  const [formState, setFormState] = useState<UserPreferences>(data.preferences);

  // Track if form fields are dirty by comparing with initial state
  const hasLocationChanged = formState.location !== data.preferences.location;
  const hasTagsChanged =
    !formState.tags?.every((tag) => data.preferences.tags?.includes(tag)) ||
    !data.preferences.tags?.every((tag) => formState.tags?.includes(tag));

  const isDirty = hasLocationChanged || hasTagsChanged;

  // Block navigation when form is dirty
  // const blocker = useBlocker(isDirty);

  // useEffect(() => {
  //   if (
  //     blocker.state === "blocked" &&
  //     !confirm("You have unsaved changes. Are you sure you want to leave?")
  //   ) {
  //     blocker.reset();
  //   }
  // }, [blocker]);

  return (
    <CustomScreen title="Preferences">
      <Form
        method="post"
        className={classNames(
          "flex w-full max-w-screen-md flex-col justify-center",
        )}
      >
        {/* Hidden inputs to capture state */}
        <input type="hidden" name="location" value={formState.location} />
        <input type="hidden" name="tags" value={formState.tags?.join(",")} />

        {/* Location Filter */}
        <LocationPreferences
          location={formState.location}
          onChange={(next) => {
            setFormState({ ...formState, location: next });
          }}
          onClear={() => {
            setFormState({ ...formState, location: data.preferences.location });
          }}
        />
        {/* Tags Filter */}
        <Section
          title="Issues"
          description={
            <>Pick up to 5. We use these to score and prioritize your feed.</>
          }
        >
          <Tagging
            maxTags={5}
            tags={data.data.availableTags}
            selected={data.preferences.tags}
            handleClick={(updatedTags) => {
              setFormState({ ...formState, tags: updatedTags });
            }}
          />
        </Section>

        {/* Todo: add notifications */}
        {/* <Section
          title="Notifications"
          description={
            <div>
              We create notifications based on your "For You feed", which is
              based on your interests and location. To get notifications,
              download the iOS App or the PWA on Android / Desktop.
            </div>
          }
        >
          <PWAInstall />
          <div></div>
        </Section> */}

        {/* todo: allow customization */}
        {/* <Section title="Theme">
          <div></div>
        </Section> */}

        {/* Save Button */}
        <div className="mt-4 flex w-full justify-center">
          <Button type="call-to-action" htmlType="submit" disabled={!isDirty}>
            Save Preferences
          </Button>
        </div>
      </Form>
    </CustomScreen>
  );
}
