export type Levels =
  | "international"
  | "country" // national reps
  | "administrativeArea1" // state reps
  | "administrativeArea2" // county reps
  | "locality" // city reps
  | "regional"
  | "special"
  | "subLocality1"
  | "subLocality2";

export interface Office {
  name: string;
  divisionId: string;
  levels: [Levels];
  roles: [string];
  sources: [
    {
      name: string;
      official: boolean;
    },
  ];
  officialIndices: [number];
}

export interface Official {
  name: string;
  address: [
    {
      locationName: string;
      line1: string;
      line2: string;
      line3: string;
      city: string;
      state: string;
      zip: string;
    },
  ];
  party: string;
  phones: [string];
  urls: [string];
  photoUrl: string;
  emails: [string];
  channels: [
    {
      type: string;
      id: string;
    },
  ];
}

export interface Divisions {
  [key: string]: {
    name: string;
    alsoKnownAs: [string];
    officeIndices: [number];
  };
}

export interface GoogleRepresentativesResponse {
  kind: "civicinfo#representativeInfoResponse";
  normalizedInput: {
    locationName: string;
    line1: string;
    line2: string;
    line3: string;
    city: string;
    state: string;
    zip: string;
  };
  divisions: Divisions;
  offices: [Office];
  officials: [Official];
}
