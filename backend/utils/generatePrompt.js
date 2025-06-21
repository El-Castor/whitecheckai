function generateScoringPrompt(whitepaperText) {
  return `
You are a crypto whitepaper analysis expert. Read the text below and evaluate it according to the 10 criteria listed. For each, return:

- A score from 0 to 10
- A brief justification (2–4 sentences max)

⚠️ Respond ONLY with a valid JSON object using this exact structure:

{
  "vision": { "score": X, "justification": "..." },
  "technical_feasibility": { "score": X, "justification": "..." },
  "team": { "score": X, "justification": "..." },
  "roadmap": { "score": X, "justification": "..." },
  "tokenomics": { "score": X, "justification": "..." },
  "partnerships": { "score": X, "justification": "..." },
  "security": { "score": X, "justification": "..." },
  "adoption": { "score": X, "justification": "..." },
  "regulation": { "score": X, "justification": "..." },
  "red_flags": { "score": X, "justification": "..." }
}

**EVALUATION CRITERIA:**

1. **Vision & Problem**: Is the mission clear and solving a real need?
2. **Technical Feasibility**: Are there technical details? Is it realistically achievable?
3. **Team**: Is the team credible, transparent, or anonymous?
4. **Roadmap**: Are the milestones clearly defined and the timelines realistic?
5. **Tokenomics**: Are the token distribution, utility, and sustainability well explained?
6. **Partnerships**: Are there real partners or investors backing the project?
7. **Security**: Are audits or security practices mentioned?
8. **Adoption**: Is the product usable, launched or in beta? Is it accessible to users?
9. **Regulation**: Are legal aspects considered? Is the project compliant?
10. **Red Flags**: Any scam signs, unrealistic claims, contradictions?

Here is the whitepaper to analyze:
"""
${whitepaperText}
"""`;
}

module.exports = { generateScoringPrompt };
