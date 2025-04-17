A proposal for how to allow users/orgs to configure custom feeds and reports, and do AI analysis of gov updates in general.

## Guiding Principles
- Decentralized organizations feeds: If users want to add an org's feed to windy civi, they most likely will have to add the url. This gives them freedom, and removes us from moderation requirements.
- Should be config based: easy enough for most organization to set up.
- Enabling GitHub Actions + GitHub Pages as the main platform, since its free and can be set up with templates.

## WIP: Config File

```yaml
# Policy Analysis Pipeline Configuration
name: "Executive Order Impact Analysis"
description: "Monitor and evaluate presidential executive orders for their impact on key activist issues"
llm_settings:
  model: "llama-2" # Gonna focus on LLMs that can run locally within Github Action's free mode.
  # ... more settings

# Pipeline definition
pipeline:
  # 1. Sources - Feeds to subscribe to
  sources:
    # Using this naming convention to allow users to select gov udpates. This `country:us` would mean all USA data would be imported.
    - '@windy-civi/ocd-division/country:us'
    # Theoretically other orgs can host the source feeds. Most ideally in the future the gov should provide this source.
    - '@datamade/ocd-division/country:us/state:il/place:chicago'   
    # By working with RSS, we allow users to us news articles for better analyzing/scoring updates.
    - "http://rss.cnn.com/rss/cnn_topstories.rss"

  # 2. Processing steps - Only tag and filter operations
  # Each step would get the following inputs
  # - event: The immutable event object, which would be of a known type by us (one of our ocd event updates, or fallback to simple RSS style)
  # - type: Describes the event type, so that we can easily get things like schema info.
  # - object: A rebuilt OCD-formatted version of the bill if its a bill, + any other OCD objects. Allows user to easily see the entire bill data.
  # - analysis: An analysis artifact that each step can add to. This could be of type {[bill_id]: {tags, summaries}}.
  pipe:
    # Filter step - Allow users to ignore data of certain types. We can provide specific baked in filters since legislation can be very noisy.
    - type: "filter"
      key: "windycivi_active_bills"

    # Tag step - Score this update against a scorecard defined by the user.
    - type: "tag"
      key: "climate_action"
      description: "Score and tag policies for climate impact"
      scorecard: "./tags/climate_action.yaml"

    # Filter step - Allow users to ignore data based on previous step analysis 
    - type: "filter"
      key: "high_impact_filter"
      description: "Filter to only include high impact policies"
      condition:
        op: "GTE"
        field: "impact_score"
        value: 3
        abs: true

  # 3. Render artifacts
  render:
    - type: "feed"
      algorithm: "relevance_score" # string enum or path to custom ranking algorithm
      title:
        type: "prompt"
        value: "./templates/feed/title_prompt.md"
        max_length: 100
      summary:
        type: "prompt" 
        value: "./templates/feed/description_prompt.md"
        max_length: 500
      image:
        type: "transformer"
        value: "./renderers/feed_media_renderer.py"

    # V1 won't have this, but have this here for the sake of making sure the YAML is extendable.
    - type: "report"
      template: "@windy-civi/session-summary"

  # 4. Publish - Send rendered content to destinations
  publish:
    # Publish to github pages if this project is in a public github repo.
    - type: "github_pages"
      rss_feeds: true

    # Publish to social medias
    - type: "bluesky"
      # ... bluesky specific credentials, including env vars for secrets
    # Other potential publishes
    - type: "reddit-bot"
    - type: "slack-bot"
    - type: "meta-threads"
    - type: "email"
```

### WIP: Prompt Template

```markdown
# Executive Summary Generation

Create a concise executive summary for a detailed policy analysis report.

## Input Data
- Policy Title: {{event.title}}
- Publication Date: {{event.publication_date}}
- Issue Area: {{event.tag_name}}
- Impact Score: {{event.impact_score}}
- Impact Description: {{event.impact_description}}
- Analysis Conclusion: {{event.conclusion}}
- Key Excerpts:
  {% for excerpt in event.relevant_excerpts %}
  - {{excerpt}}
  {% endfor %}

## Requirements
- Maximum length: 800 characters
- Provide a high-level overview of the policy
- Summarize the key findings from the analysis
- Highlight the most significant impacts
- Present information in a balanced, objective manner
- Use clear, professional language appropriate for policymakers

## Output Format
Generate a well-structured executive summary with no additional explanation.
```

## Moonshot: Coalition Graph i.e. Rainbow Coalition 2.0

With this config data + doing regular scraping of politican sites, we can create a knowledge graph of related issues, discovering potential coalitions between groups. 

### Prior Art: 
- [Fred Hampton's Rainbow Coalition](https://en.wikipedia.org/wiki/Rainbow_Coalition_(Fred_Hampton)), where Black Panthers made a coalition with a White Nationalist group in name of fighting for economic inequality.

### Example 

```
[Politician: Rep. Andy Harris (R)] ----addresses----> [Statement: "Adjusting Tax Rates for Million-Dollar Earners"]
        |                                                       |
        |                                                  similar_to
        |                                                       |
        |                           [Statement: "Tax the Ultra-Wealthy for Economic Justice"]
        |                                                       |
        |                                                       |
        |                                                       |
[Politician: Sen. Bernie Sanders (D)] ----addresses------------|
        |                                                       |
        |                                               categorized_as
        |                                                       |
        \----supports----> [Topic: Taxation of Wealthy] <----supports---- [Politician: Sen. Bernie Sanders (D)]
                                    |
                                    |
                               relates_to
                                    |
                                    v
                           [Topic: Economic Inequality]
```

### Graph Structure

**Nodes:**
- **Politicians**: Elected officials or candidates
- **Raw Issue Statements**: Original text from websites
- **Topic Categories**: Standardized high-level categories (healthcare, economy, etc.)
- **Concepts**: Key terms appearing across issues

**Relationships:**
- **Addresses**: Politician → Issue Statement
- **Categorized_As**: Issue Statement → Topic Category
- **Similar_To**: Connects similarly worded statements
- **Supports/Opposes**: Politician stance on issues
- **Relates_To**: Topic ↔ Topic connections

### Issue Normalization Approach

Our solution addresses differently worded issues through:
- Semantic similarity matching between statements
- Mapping raw statements to standardized topics
- Preserving original framing while enabling comparison
- Calculating confidence scores for topic assignments


