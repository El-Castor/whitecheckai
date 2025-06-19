function generateScoringPrompt(whitepaperText) {
    return `
  You are an expert crypto analyst. Analyze the following white paper content and evaluate it using the 10 scoring criteria below. For each one, return:
  
  - A score from 0 to 10
  - A brief justification (2-4 sentences max)
  
  Output your result in JSON with fields: vision, technical_feasibility, team, roadmap, tokenomics, partnerships, security, adoption, regulation, red_flags.
  
  CRITERIA:
  1. Vision & Problem: Is the mission clear and solving a real need?
  2. Technical Feasibility: Are there concrete technical details? Is it realistic?
  3. Team: Is the team credible and transparent? Are they anonymous?
  4. Roadmap: Are the steps clearly laid out? Are timelines realistic?
  5. Tokenomics: Are token distribution, utility, and sustainability well explained?
  6. Partnerships: Are they backed by real partners or investors?
  7. Security: Are audits or security practices mentioned?
  8. Adoption: Is the product usable or in beta? Is it accessible to users?
  9. Regulation: Are legal considerations mentioned? Is it compliant?
  10. Red Flags: Are there signs of scam, unrealistic promises, contradictions?
  
  Analyze the white paper content below:
  
  ${whitepaperText}
    `;
  }
  
  module.exports = {
    generateScoringPrompt
  };
  