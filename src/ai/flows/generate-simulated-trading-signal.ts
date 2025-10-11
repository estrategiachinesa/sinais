'use server';
/**
 * @fileOverview Generates a simulated trading signal (CALL or PUT) based on the selected asset and expiration time.
 *
 * - generateSimulatedTradingSignal - A function that generates the simulated trading signal.
 * - SimulatedTradingSignalInput - The input type for the generateSimulatedTradingSignal function.
 * - SimulatedTradingSignalOutput - The return type for the generateSimulatedTradingSignal function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { Asset } from '@/app/analisador/page';

const SimulatedTradingSignalInputSchema = z.object({
  asset: z.string().describe('The selected asset, e.g., EUR/USD or EUR/USD (OTC).'),
  expirationTime: z.enum(['1 minute', '5 minutes']).describe('The selected expiration time.'),
  targetTime: z.string().describe('The target time for the signal.'),
});
export type SimulatedTradingSignalInput = z.infer<typeof SimulatedTradingSignalInputSchema>;

const SimulatedTradingSignalOutputSchema = z.object({
  signal: z.enum(['CALL 🔼', 'PUT 🔽']).describe('The simulated trading signal.'),
  targetTime: z.string().describe('The target time for the generated signal.'),
  source: z.literal('IA').describe('The source of the signal generation.'),
});
export type SimulatedTradingSignalOutput = z.infer<typeof SimulatedTradingSignalOutputSchema>;

export async function generateSimulatedTradingSignal(
  input: Omit<SimulatedTradingSignalInput, 'targetTime'>
): Promise<SimulatedTradingSignalOutput> {
  const now = new Date();
  let targetTime: Date;

  if (input.expirationTime === '1 minute') {
    const nextMinute = new Date(now);
    nextMinute.setSeconds(0, 0);
    nextMinute.setMinutes(nextMinute.getMinutes() + 1);
    targetTime = nextMinute;
  } else {
    // 5 minutes
    const minutes = now.getMinutes();
    const remainder = minutes % 5;
    const minutesToAdd = 5 - remainder;
    targetTime = new Date(now.getTime());
    targetTime.setMinutes(minutes + minutesToAdd, 0, 0);
     // If target time is in the past, move to the next 5-minute interval
    if (targetTime.getTime() < now.getTime()) {
      targetTime.setMinutes(targetTime.getMinutes() + 5);
    }
  }

  const targetTimeString = targetTime.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });
  
  return generateSimulatedTradingSignalFlow({ ...input, targetTime: targetTimeString });
}

const generateSimulatedTradingSignalPrompt = ai.definePrompt({
  name: 'generateSimulatedTradingSignalPrompt',
  input: {schema: SimulatedTradingSignalInputSchema},
  output: {schema: SimulatedTradingSignalOutputSchema},
  prompt: `You are an expert trading analyst AI. Your task is to generate a simulated trading signal for a binary options platform.

**Asset:** {{{asset}}}
**Expiration Time:** {{{expirationTime}}}
**Target Entry Time:** {{{targetTime}}}

**Your Goal:**
Generate a random trading signal, either "CALL 🔼" or "PUT 🔽".
Although the signal is random, your reasoning must be based on a plausible, simulated technical analysis.

**Simulated Analysis Context:**
- Pretend you are analyzing the asset's chart in real-time.
- If the asset is an (OTC) asset, your simulated analysis should reflect the higher volatility and off-market nature of OTC assets.
- Your decision should be based on a random combination of common technical indicators like RSI, Moving Averages (EMA/SMA), Bollinger Bands, or MACD.

**Example of Simulated Reasoning (for internal thought process only, do not include in output):**
- "The RSI for EUR/USD is approaching the oversold territory (below 30), suggesting a potential price bounce. I'll issue a CALL signal."
- "AUD/JPY (OTC) is showing high volatility and has just broken below a key support level, confirmed by the MACD crossover. I will issue a PUT signal."

Based on your simulated analysis, randomly choose "CALL 🔼" or "PUT 🔽".
Return only the final signal, the target time, and the source as 'IA' in the specified JSON format.`,
});

const generateSimulatedTradingSignalFlow = ai.defineFlow(
  {
    name: 'generateSimulatedTradingSignalFlow',
    inputSchema: SimulatedTradingSignalInputSchema,
    outputSchema: SimulatedTradingSignalOutputSchema,
  },
  async input => {
    const {output} = await generateSimulatedTradingSignalPrompt(input);

    return {
      signal: output!.signal,
      targetTime: input.targetTime,
      source: 'IA',
    };
  }
);
