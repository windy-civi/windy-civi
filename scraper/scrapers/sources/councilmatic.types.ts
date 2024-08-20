export type Sponsor = {
  name: string;
  person_id: string | null;
  role: string;
  district: string;
  bill_id: string;
};

export type Vote = {
  motion_classification: string[];
  created_at: string;
  bill_id: string;
};

export type Bill = {
  id: string;
  title: string;
  extras: string; // is stringified json
  actions: string;
  classification: string;
  identifier: string;
  link: string;
  url: string;
  status: string[]; // is stringified json
  statusDate: string;
  source_id: string;
  sponsors: Sponsor[];
  voteHistory: Vote[];
};

export type CouncilmaticResponse<T extends object> = {
  rows: T[];
};
