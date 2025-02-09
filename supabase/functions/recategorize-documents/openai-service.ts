
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.3.0';
import { validCategories, validSections, validDifficulties } from './config.ts';

export class OpenAIService {
  private openai: OpenAIApi;

  constructor(apiKey: string) {
    this.openai = new OpenAIApi(new Configuration({ apiKey }));
  }

  async analyzeDocument(content: string) {
    const response = await this.openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a financial document analyzer specializing in forex and trading documents. 
          Analyze the given text and return ONLY a JSON object with these exact fields:
          {
            "category": one of ["forex", "trading", "risk_management", "market_analysis", "technical_analysis", "uncategorized"],
            "section": one of ["theory", "practice", "case_study", "reference", "general"],
            "difficulty": one of ["beginner", "intermediate", "advanced", "expert"]
          }`
        },
        {
          role: "user",
          content: content.slice(0, 2000)
        }
      ],
      temperature: 0.1
    });

    const analysisText = response.data?.choices?.[0]?.message?.content.trim();
    const analysis = JSON.parse(analysisText);

    if (!this.validateAnalysis(analysis)) {
      throw new Error('Invalid fields in analysis');
    }

    return analysis;
  }

  private validateAnalysis(analysis: any) {
    return analysis.category && validCategories.includes(analysis.category) &&
           analysis.section && validSections.includes(analysis.section) &&
           analysis.difficulty && validDifficulties.includes(analysis.difficulty);
  }
}
