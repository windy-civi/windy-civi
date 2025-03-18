import { Form, useLoaderData } from "react-router-dom";
import { Button, CustomScreen, Section, Tagging } from "../design-system";
import { useState } from "react";
import { LocationPreferences } from "./components/Filters";
import { UserPreferencesLoaderData } from "./types";
import { PWAInstall } from "./components/PwaInstaller";
import { UserPreferences } from "@windy-civi/domain/user-preferences";
import { classNames } from "../design-system/styles";
export function Preferences() {
  const data = useLoaderData() as UserPreferencesLoaderData;

  const [formState, setFormState] = useState<UserPreferences>(data.preferences);

  // const afterLocation = getLegislators(data.offices).length > 0 && (
  //   <>
  //     <Divider type="white" className="my-2 lg:my-3" />
  //     <LegislatorsInfo
  //       className={classNames("opacity-80")}
  //       offices={data.offices}
  //       location={filterState.location}
  //       showAllReps={() => {}}
  //     />
  //   </>
  // );

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
          // afterLocation={afterLocation}
          onChange={(next) => {
            setFormState({ ...formState, location: next });
          }}
          onClear={() => {
            setFormState({ ...formState, location: data.preferences.location });
          }}
        />
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
          <PWAInstall />
          <div></div>
        </Section>
        {/* Tags Filter */}
        <Section
          title="Issues"
          description={
            <>Pick up to 3. We use these to score and prioritize your feed.</>
          }
        >
          <Tagging
            tags={data.data.availableTags}
            selected={data.preferences.tags}
            handleClick={(updatedTags) => {
              setFormState({ ...formState, tags: updatedTags });
            }}
          />
        </Section>

        {/* todo: allow customization */}
        {/* <Section title="Theme">
          <div></div>
        </Section> */}

        {/* Save Button */}
        <div className="mt-4 flex w-full justify-center">
          <Button type="submit">Save Preferences</Button>
        </div>
      </Form>
    </CustomScreen>
  );
}
