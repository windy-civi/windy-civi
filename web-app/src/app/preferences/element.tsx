import { Form, useLoaderData } from "react-router-dom";
import {
  Button,
  classNames,
  CustomScreen,
  Section,
  Tagging,
} from "../design-system";
import { useState } from "react";
import { LocationPreferences } from "./components/Filters";
import { AddressLookup } from "./components/AddressLookup";
import { UserPreferences } from "@windy-civi/domain/types";
import { UserPreferencesLoaderData } from "./types";

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
          title="Your Representatives"
          description={
            <div>
              Use your address to save your elected officials and see the bills
              they sponsor. We use Google Civic Information API to get this
              information, and your address is not saved on any server.
            </div>
          }
        >
          <div className="flex flex-row gap-2">
            <div
              className={classNames(
                "flex-1 rounded-md bg-black bg-opacity-30 shadow-md",
              )}
            >
              <AddressLookup
                // before={
                //   <button
                //     className="text-white opacity-60 hover:opacity-100"
                //     onClick={() => props.onChange(SupportedLocale.USA)}
                //   >
                //     <FaBackspace />
                //   </button>
                // }
                onClear={() => {}}
                onPlaceSelected={
                  () => {}
                  // (address) => {
                  // props.onChange({ address });
                  // }
                }
                value={""}
              />
            </div>
          </div>
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
}
