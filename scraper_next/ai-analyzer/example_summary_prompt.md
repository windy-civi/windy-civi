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
