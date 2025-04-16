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


## Proposals

## Potential Folder Structure + Filename Convention

```
ocd-jurisdiction
	/country:us
		/state:fl/government
			/sessions
				/session-214
					/bills
						/HB250
								vote_event_{timestamp}.json
								bill_event_somenamingconvetion.json
								bill_event_somenamingconvetion.json
					/votes
						hb250/
			/events
```				

### Other Events To Consider

```
// bill.actions
// bill.sponsorships
// bill.versions
// bill.scrape_correction
  // the scraper got messsed up and we need to update some old data.
```

### How to handle metadata changes

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

## To Solve

### Solving Unique IDs
There are a lot of OpenStates generaated UUIDs. Ideally, our folder/file strucutre + naming convention should follow actual legislative data instead of generated data like UUIDs.

- Jurisdiction ID: will follow OCD ID naming convention for folder structure `country:us/state:fl/government`
- Session ID: TODO
- Bill ID: `jurisidiction_id/sessions/:session_id`/`bill.identifier` - This ID should be the government ID, like HB250
- Vote Event ID: TODO
- Person ID: TODO
- Event ID: TODO

### Solving Bill Folder + Filename Convention
- `bill.metadata`: `bill_id`/log/metadata_update_{TODO}.json
- `bill.actions`: `bill_id`/log/action_{TODO}.json
- `bill.votes`: `bill_id`/log/vote_{TODO}.json
- `bill.sponsors`: `bill_id`/log/sponsor_update{TODO}.json
- `bill.versions`: `bill_id`/files/version_{TODO}.pdf + `bill_id`/log/version_add{TODO}.json (we can extract the content as JSON)
- `bill.documents`: `bill_id`/files/documents_{TODO}.pdf + `bill_id`/log/document_add{TODO}.json (we can extract the content as JSON)
