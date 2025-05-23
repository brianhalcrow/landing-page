import { OpenAI } from "https://esm.sh/openai@4.24.1"
import { ExposureType } from "./data-service.ts"

export interface ExtractedCurrency {
  base_currency: string;
  quote_currency: string;
  tenor: number;
}

export interface ExtractedEntity {
  entity_name: string;
}

export async function extractCurrencyInfo(openai: OpenAI, message: string, schemaContext: string) {
  const currencyExtraction = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{
      role: 'system',
      content: `You have access to the following database schema:\n\n${schemaContext}\n\nExtract currency pair and tenor information from the message. Return only a JSON object with base_currency, quote_currency, and tenor fields, for example: {"base_currency": "GBP", "quote_currency": "USD", "tenor": 90}. No other text, no markdown.`
    }, {
      role: 'user',
      content: message
    }]
  });

  if (!currencyExtraction.choices[0]?.message?.content) {
    return null;
  }

  const cleanedContent = currencyExtraction.choices[0].message.content
    .replace(/```json[\s\n]*/, '')
    .replace(/[\s\n]*```[\s\n]*$/, '')
    .trim();

  try {
    return JSON.parse(cleanedContent) as ExtractedCurrency;
  } catch (error) {
    console.error('Error parsing currency extraction response:', error);
    return null;
  }
}

export async function extractEntityInfo(openai: OpenAI, message: string, schemaContext: string) {
  const entityExtraction = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{
      role: 'system',
      content: `You have access to the following database schema:\n\n${schemaContext}\n\nExtract any entity names mentioned in the message. Return only a JSON object with entity_name field, for example: {"entity_name": "Sense Inc"}. No other text, no markdown.`
    }, {
      role: 'user',
      content: message
    }]
  });

  if (!entityExtraction.choices[0]?.message?.content) {
    return null;
  }

  const cleanedContent = entityExtraction.choices[0].message.content
    .replace(/```json[\s\n]*/, '')
    .replace(/[\s\n]*```[\s\n]*$/, '')
    .trim();

  try {
    return JSON.parse(cleanedContent) as ExtractedEntity;
  } catch (error) {
    console.error('Error parsing entity extraction response:', error);
    return null;
  }
}

export async function generateChatResponse(
  openai: OpenAI, 
  message: string, 
  context: string,
  exposureTypes?: ExposureType[]
) {
  const exposureContext = exposureTypes?.length 
    ? `\n\nAvailable exposure types for this entity:
      ${exposureTypes.map(type => 
        `- ${type.exposure_category_l1} > ${type.exposure_category_l2} > ${type.exposure_category_l3} (${type.subsystem})`
      ).join('\n')}`
    : '';

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: context ? [
      {
        role: 'system',
        content: context + exposureContext + `\n\nWhen discussing exposures:
        - Reference the specific exposure categories (L1, L2, L3) when applicable
        - Mention the relevant subsystem (GL, AP, AR, PO) when discussing specific exposures
        - Consider the entity's configured exposure types when making recommendations`
      },
      { 
        role: 'user', 
        content: message 
      }
    ] : [
      { 
        role: 'user', 
        content: message 
      }
    ]
  });

  if (!completion.choices[0]?.message?.content) {
    throw new Error('No response received from OpenAI');
  }

  return completion.choices[0].message.content;
}
