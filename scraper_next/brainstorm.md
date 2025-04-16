# Brainstorm: Open Civic Data Format => Open Civic Blockchain Format

## Communications
- [Discussion via Slack](https://chihacknight.slack.com/archives/C047500M5RS/p1744230231887699)
- [Task Board via Slack](https://chihacknight.slack.com/lists/T04KM9VQY/F07ECPCHH5M?view_id=View08NQ33E5R7)
- (this file) [Collaborative Brainstorming via Git](https://github.com/windy-civi/windy-civi/blob/60-blockchain-open-civic-data/scraper_next/brainstorm.md): Feel free to edit.

## Prior Art
- [Washington DC made Github](https://github.com/DCCouncil/law-xml) their official law source of truth. It looks immutable.
- [How append-only logs are used in p2p/blockchain applications](https://scuttlebot.io/more/protocols/secure-scuttlebutt.html).
- [Beginners Guide To Event Sourced DB](https://www.kurrent.io/event-sourcing)

## Why Use a Hashed Append-Only Log?

- 🔐 **Truly Peer-to-Peer**  
  Everyone keeps their own copy of the data—no central server needed, no extra cost.

- 📜 **The Constitution Is Basically a Blockchain**  
  Government changes through amendments. Our log reflects this: permanent, append-only, and transparent.

- 💻 **Highly Tailored Custom Feeds Built With Code + AI**  
  Composable event logs will be easy to filter, tag, and summarize. Orgs can compose those feeds too in order to make highly tailored feeds for publishing.

- 🤖 **Bots Can Build On Bots**  
  Organizations can automate updates—think Reddit replies or Bluesky posts—on top of each other.

- ⛓️ **Trust Without a Middleman**  
  Blockchain hashes + public key signatures let users verify data themselves. We use [Decentralized Identifiers](https://www.w3.org/TR/did-1.0/), just like Bluesky.

- 📢 **So Many Outputs**  
  Supports everything: peer-to-peer, pub-sub, polling, WebRTC, email, RSS, push—notifications, etc. They will all work naturally.

- ⏪ **Bonus: Reveal Power Dynamics**  
  Replay legislative logs to uncover hidden patterns—who votes when, with whom, and under whose influence.

- 📱 **Smarter P2P Windy Civi Client (+ others can make competitor clients)**  
  By being P2P, it's easier for us to implement things like decentralized notifications.
  Also, anyone else can make client apps too, so the dataset could outlive our app.

- 🛜 **Works For Free With RSS Feeds**  
  By being feed based, we can also import any RSS feeds with easy into our pipelines, allowing us to get things like Executive Order RSS feeds and Judicial decision feeds easily.

---

## Why Open Civic Data as the Base Schema?

- 🤝 **Plug Into the Civic Tech Ecosystem**  
  Uses familiar Open Civic Data formats, making it easy to integrate with existing tools and scrapers.

- 🔄 **Reuse Existing Data**  
  Works with platforms like OpenStates and Councilmatic, giving us access to many data sources.
  
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

#### TODO

##### Timestamps: Scrape Oriented vs Gov Oriented
Are log timestamps the time we scraped, or the gov update? What if a specific event doesn't have a timestamp?
[Open Civic Data also discussed this](https://open-civic-data.readthedocs.io/en/latest/proposals/0101.html)

##### Unique IDs
There are a lot of OpenStates generaated UUIDs. Ideally, our folder/file strucutre + naming convention should follow actual legislative data instead of generated data like UUIDs.

- Jurisdiction ID: will follow OCD ID naming convention for folder structure `country:us/state:fl/government`
- Session ID: TODO
- Bill ID: `jurisidiction_id/sessions/:session_id`/`bill.identifier` - This ID should be the government ID, like HB250
- Vote Event ID: TODO
- Person ID: TODO
- Event ID: TODO

##### Bill Folder + Filename Convention
- `bill.metadata`: `bill_id`/log/metadata_update_{TODO}.json
- `bill.actions`: `bill_id`/log/action_{TODO}.json
- `bill.votes`: `bill_id`/log/vote_{TODO}.json
- `bill.sponsors`: `bill_id`/log/sponsor_update{TODO}.json
- `bill.versions`: `bill_id`/files/version_{TODO}.pdf + `bill_id`/log/version_add{TODO}.json (we can extract the content as JSON)
- `bill.documents`: `bill_id`/files/documents_{TODO}.pdf + `bill_id`/log/document_add{TODO}.json (we can extract the content as JSON)

##### Event Folder Convention
I think putting events specific to sessions within the session makes sense, but what about out of session events? Can we find some other reliable time span?

### Git Architecture

We plan to auto-generate many git repo. 

**Why Git:**
- Of all data structures, folders+files are the most portable/readable by the most people.
- Git is naturally p2p (its also built on a distributed log), making `git pull` an easy method to get updated data within our WindyCivi app and AI workflows.
- GitHub makes exploring git easy. It's rich markdown and file renderes make it easy for people to explore without downloading.
- Git submodules allows us to have a way to separate repos so 1 repo doesn't get too big in size.

#### Session Git Repo

This repo should be a blockchain-like append only log, making syncing data as easy as `git pull`.

**Question:** what about the files like PDFS? They feel right to keep in here as a copy, but also, would balloon the size of these. Maybe yet another submodule for session files?

```
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

#### Locale Git Repo
Overall locale repo (also generated). Contain links to git submodules that have event logs for different sessions/events. Will also contain scripts to rebuild data into Open Civic Data formats.

```
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
The primary repo (also generated) that people can clone to get all civic data easily via the submodules.

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
Also, lets check out JSON Patch: https://jsonpatch.com
```
// bill.metadata_events
{
    fieldMask: ["from_organization"]
    bill: {
        from_organization: ""
    }
}
```
