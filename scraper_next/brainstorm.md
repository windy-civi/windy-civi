# Brainstorm: Open Civic Data => Blockchain

## Important Links

- [Discussion via Slack](https://chihacknight.slack.com/archives/C047500M5RS/p1744230231887699)
- [Task Board via Slack](https://chihacknight.slack.com/lists/T04KM9VQY/F07ECPCHH5M?view_id=View08NQ33E5R7)
- (this file) [Collaborative Brainstorming via Git](https://github.com/windy-civi/windy-civi/blob/60-blockchain-open-civic-data/scraper_next/brainstorm.md): Feel free to edit.

## Overview

By building Open Civic Data like as an immutable append-only event log, we can better enable a number of things.

Both our data sources ([openstates](https://github.com/openstates/openstates-scrapers) and [councilmatic](https://github.com/datamade/chicago-council-scrapers)), expose things in the open civic data format. So making our model be backwards compatible with opencivicdata would make interop and chance of adoption by other orgs more likely.

- Publish to All Social Media: P2P social media is built on blockchain tech. By having events, we can easily publish updates to different automated feeds across BlueSky, Mastadon, etc.
- For WindyCivi client app: Our client app can sync just updated info, which will allow Windy Civi to better serve push, and be a Web3 app.
- AI Workflows: Our future AI workflows can easily just iterate over the event logs.

### Prior art/reading:
- [Washington DC made Github](https://github.com/DCCouncil/law-xml) their official law source of truth. It looks immutable.
- [How append-only logs are used in p2p/blockchain applications](https://scuttlebot.io/more/protocols/secure-scuttlebutt.html).

## Exploring Data

### State/Federal Legislation (via OpenStates)
- [How to run the OpenStates Scraper](https://docs.openstates.org/contributing/scrapers/#running-your-first-scraper)
- [State/Federal OpenStates Data Explorer](https://jstrieb.github.io/link-lock/#eyJ2IjoiMC4wLjEiLCJlIjoia1V2WEx4YUJnWlUzaXFYODdGbTM4TEd6ajVKVXYyK01tVUxFWXBjSHpoalBqZEZRVE4vRGFGU2hZRjRpRTdxMjBWU3poaS9RNG1wNiIsInMiOiJUTnROd2J3dHNxdjQrSEdlVnV3SzhRPT0iLCJpIjoieEZoK2xtZXJlZTRRMk1JQSJ9)
  - password is ChiHackNight closing group phrase all lowercase
- **Scrape Options + Tradeoffs**
  - (We are using this for v1) [By running the scrapers directly](https://github.com/openstates/openstates-scrapers) Data will be much more up to date as it scrapes data directly.
  - [via SQL Dump](https://open.pluralpolicy.com/data/), which updates every few days, and has bill full text, in addition to a lot of other content like maps data.

### Chicago Legislation (via Councilmatic)
Councilmatic also exports data in OCD format.
  - [Chicago OCD Data Explorer](https://puddle.datamade.us/chicago_council-347e82e) Explore Councilmatic PG Dump for Chicago OCD data


## Proposal

### Folder Structure + Filename Convention

```
/open-civic-data-blockchain/
├── country:us/                                 # United States
│   ├── state:il/                               # Illinois state
│   │   ├── sessions/                           # Legislative sessions
│   │   │   ├── ocd-session/country:us/state:il/2023-2024/  # Full OCD session ID
│   │   │   │   ├── bills/                      # Bills in this session
│   │   │   │   │   ├── sb1234/                 # Senate Bill 1234
│   │   │   │   │   │   ├── logs/               # Event logs folder
│   │   │   │   │   │   │   ├── 20240115T123045Z_session_bill_created.json  # Initial bill creation in session
│   │   │   │   │   │   │   ├── 20240115T123045Z_metadata_created.json      # Initial metadata creation
│   │   │   │   │   │   │   ├── 20240117T143022Z_metadata_updated.json      # Metadata update with field mask
│   │   │   │   │   │   │   ├── 20240117T143156Z_sponsor_added.json         # Sponsors added
│   │   │   │   │   │   │   ├── 20240120T092133Z_version_added.json         # Version document added
│   │   │   │   │   │   │   ├── 20240130T152247Z_action_added.json          # Action recorded
│   │   │   │   │   │   │   ├── 20240215T103045Z_doc_added.json             # Supporting document added
│   │   │   │   │   │   │   ├── 20240315T140011Z_vote_initiated.json        # Vote started
│   │   │   │   │   │   │   ├── 20240315T143022Z_vote_updated.json          # Vote partial results
│   │   │   │   │   │   │   └── 20240315T150537Z_vote_finalized.json        # Vote complete
│   │   │   │   │   │   └── files/              # Raw file storage
│   │   │   │   │   │       ├── bill_introduced.pdf      # Original version document
│   │   │   │   │   │       ├── bill_amended.pdf         # Amended version document
│   │   │   │   │   │       └── fiscal_note.pdf          # Supporting document
│   │   │   │   │   ├── hb0789/                 # House Bill 789
│   │   │   │   │   │   ├── logs/               # Event logs folder
│   │   │   │   │   │   │   ├── 20240118T090023Z_session_bill_created.json  # Initial bill creation in session
│   │   │   │   │   │   │   ├── 20240118T090023Z_metadata_created.json      # Initial metadata creation
│   │   │   │   │   │   │   └── ...
│   │   │   │   │   │   └── files/              # Raw file storage
│   │   │   │   │   │       └── ...
│   │   │   │   │   └── ...
│   │   │   │   └── events/                     # Events for this session
│   │   │   │       ├── 2024-04-15-senate-appropriations-hearing.json  # Senate committee hearing
│   │   │   │       ├── 2024-02-22-house-floor-session.json            # House floor session
│   │   │   │       └── ...
│   │   │   ├── ocd-session/country:us/state:il/2021-2022/  # Previous session
│   │   │   │   └── ...
│   │   │   └── ...
│   │   └── events/                            # Events not tied to a specific session
│   │       ├── 2024-07-15-joint-commission-meeting.json  # Joint commission meeting
│   │       ├── 2024-08-20-special-task-force.json        # Special task force meeting
│   │       └── ...
│   ├── state:ca/                               # California state
│   │   └── ...
│   └── state:ny/                               # New York state
│       └── ...
└── country:ca/                                 # Canada
    └── ...
```				


### Git Architecture

#### Session Repo
```
# This repo should be a blockchain-like append only log
/
├── README.md                  # Session-specific information
├── bills/                     # Bills in this session
│   ├── sb1234/                # Senate Bill 1234
│   │   ├── logs/              # Event logs folder
│   │   │   ├── 20240115T123045Z_session_bill_created.json
│   │   │   ├── 20240115T123045Z_metadata_created.json
│   │   │   ├── 20240117T143022Z_metadata_updated.json
│   │   │   └── ...
│   │   └── files/             # Raw file storage
│   │       ├── bill_introduced.pdf
│   │       ├── bill_amended.pdf
│   │       └── fiscal_note.pdf
│   ├── hb0789/                # House Bill 789
│   │   ├── logs/
│   │   │   └── ...
│   │   └── files/
│   │       └── ...
│   └── ...
└── events/                    # Events for this session
    ├── 2024-04-15-senate-appropriations-hearing.json
    ├── 2024-02-22-house-floor-session.json
    └── ...
```

#### Locale Repo
Will contain links to git submodules that have event logs for different sessions. Will also contain scripts to rebuild data easily.

```
# This repository implements the Open Civic Data format as a git-based system.
# Git submodules function as append-only blockchain logs to track all changes
# with complete history and traceability.

ocd-blockchain-illinois/
├── .gitmodules
├── README.md
├── scripts/
│   ├── scrape.py # Shortcut to directly scrape for this locale
|   └── rebuild.py # To rebuild OCD data from blockchain logs
├── sessions/
│   ├── ocd-blockchain-illinois/ocd-session/country:us/state:il/2023-2024/
│   ├── ocd-blockchain-illinois/ocd-session/country:us/state:il/2021-2022/
│   └── ocd-blockchain-illinois/ocd-session/country:us/state:il/2019-2020/
└── events/
   ├── 2022-2026/
   ├── 2018-2022/
   └── 2014-2018/
```

#### Main Repo

```
open-civic-data-blockchain/
├── .gitmodules
├── README.md
├── scripts/
│   ├── update_all.sh
│   ├── integrity_check.py
│   └── generate_cross_jurisdictional_report.py
└── jurisdictions/
    ├── country:us/
    │   ├── state:il/                           # Illinois submodule
    │   ├── state:ca/                           # California submodule
    │   ├── state:ny/                           # New York submodule
    │   ├── district:dc/                        # Washington DC submodule
    │   ├── county:us/state:va/fairfax/         # Fairfax County submodule
    │   └── place:us/state:tx/austin/           # City of Austin submodule
    ├── country:ca/
    │   ├── province:on/                        # Ontario province submodule
    │   └── province:bc/                        # British Columbia submodule
    └── country:uk/
        ├── england/                            # England submodule
        └── scotland/                           # Scotland submodule
```

#### How to handle metadata changes

The metadata in `bill` can change scrape over scrape. We can use the fieldMask method here for keeping events small.

```
// bill.metadata_events
{
    fieldMask: ["from_organization"]
    bill: {
        from_organization: ""
    }
}
```

## TODO

### Timestamps: Scrape Oriented vs Gov Oriented
Are log timestamps the time we scraped, or the gov update? What if a specific event doesn't have a timestamp?

### Unique IDs
There are a lot of OpenStates generaated UUIDs. Ideally, our folder/file strucutre + naming convention should follow actual legislative data instead of generated data like UUIDs.

- Jurisdiction ID: will follow OCD ID naming convention for folder structure `country:us/state:fl/government`
- Session ID: TODO
- Bill ID: `jurisidiction_id/sessions/:session_id`/`bill.identifier` - This ID should be the government ID, like HB250
- Vote Event ID: TODO
- Person ID: TODO
- Event ID: TODO

### Bill Folder + Filename Convention
- `bill.metadata`: `bill_id`/log/metadata_update_{TODO}.json
- `bill.actions`: `bill_id`/log/action_{TODO}.json
- `bill.votes`: `bill_id`/log/vote_{TODO}.json
- `bill.sponsors`: `bill_id`/log/sponsor_update{TODO}.json
- `bill.versions`: `bill_id`/files/version_{TODO}.pdf + `bill_id`/log/version_add{TODO}.json (we can extract the content as JSON)
- `bill.documents`: `bill_id`/files/documents_{TODO}.pdf + `bill_id`/log/document_add{TODO}.json (we can extract the content as JSON)
