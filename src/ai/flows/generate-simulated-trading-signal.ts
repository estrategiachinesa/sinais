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

const SimulatedTradingSignalInputSchema = z.object({
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
    targetTime = new Date(now.getTime());
    targetTime.setMinutes(now.getMinutes() + 1, 0, 0);
  } else {
    // 5 minutes
    const minutes = now.getMinutes();
    const remainder = minutes % 5;
    const minutesToAdd = 5 - remainder;
    targetTime = new Date(now.getTime());
    targetTime.setMinutes(minutes + minutesToAdd, 0, 0);
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
  prompt: `Based on the selected expiration time of {{{expirationTime}}}, generate a simulated trading signal for the next target time of {{{targetTime}}}.

The signal should randomly be either "CALL 🔼" or "PUT 🔽".  Return the generated signal, the target time, and the source as 'IA'.`,
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
