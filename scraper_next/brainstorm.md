## Potential Folder Structure + Filename Convention

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
				

## Other Events

// bill.actions
// bill.sponsorships
// bill.versions
// bill.scrape_correction
  // the scraper got messsed up and we need to update some old data.

  
##  untouchable fields
identifier

## How to handle metadata changes
// bill.metadata_events
{
    fieldMask: ["from_organization"]
    bill: {
        from_organization: ""
    }
}
