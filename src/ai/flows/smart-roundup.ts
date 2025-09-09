'use server';

/**
 * @fileOverview Provides a Genkit flow for smart price rounding to make them more appealing to customers.
 *
 * - smartRoundup - A function that rounds prices up or down using AI to be more attractive to customers.
 * - SmartRoundupInput - The input type for the smartRoundup function.
 * - SmartRoundupOutput - The return type for the smartRoundup function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartRoundupInputSchema = z.object({
  price: z.number().describe('The original price of the item.'),
});
export type SmartRoundupInput = z.infer<typeof SmartRoundupInputSchema>;

const SmartRoundupOutputSchema = z.object({
  roundedPrice: z
    .number()
    .describe(
      'The price rounded up or down using AI to make it more attractive to the customer.'
    ),
  reason: z
    .string()
    .describe(
      'The reasoning behind the price adjustment, explaining why the price is more customer-friendly.'
    ),
});
export type SmartRoundupOutput = z.infer<typeof SmartRoundupOutputSchema>;

export async function smartRoundup(input: SmartRoundupInput): Promise<SmartRoundupOutput> {
  return smartRoundupFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartRoundupPrompt',
  input: {schema: SmartRoundupInputSchema},
  output: {schema: SmartRoundupOutputSchema},
  prompt: `You are an AI assistant designed to help cashiers make prices more appealing to customers. Given a price, you will intelligently round the price either up or down to make it more attractive to the customer.

Original Price: {{{price}}}

Consider psychological pricing strategies (e.g., ending in .99, avoiding round numbers for lower prices).
Return the rounded price and a brief explanation of why the adjustment was made to be more customer-friendly.  Explain the benefits of the change to the store.
`,
});

const smartRoundupFlow = ai.defineFlow(
  {
    name: 'smartRoundupFlow',
    inputSchema: SmartRoundupInputSchema,
    outputSchema: SmartRoundupOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
