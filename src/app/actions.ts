// 'use server';

// import { smartRoundup } from '@/ai/flows/smart-roundup';
import { z } from 'zod';

const roundupSchema = z.object({
  price: z.coerce.number().positive('Price must be a positive number.'),
});

export type RoundupState = {
  message?: string;
  result?: {
    roundedPrice: number;
    reason: string;
  };
  errors?: {
    price?: string[];
  };
};

export async function runSmartRoundup(
  prevState: RoundupState | undefined,
  formData: FormData
): Promise<RoundupState> {
  // const validatedFields = roundupSchema.safeParse({
  //   price: formData.get('price'),
  // });

  // if (!validatedFields.success) {
  //   return {
  //     message: 'Invalid price provided.',
  //     errors: validatedFields.error.flatten().fieldErrors,
  //   };
  // }

  // try {
  //   const result = await smartRoundup({ price: validatedFields.data.price });
  //   return {
  //     message: 'Success',
  //     result,
  //   };
  // } catch (error) {
  //   console.error(error);
  //   return {
  //     message: 'An error occurred while rounding the price.',
  //   };
  // }
  return { message: 'This feature is temporarily disabled.'};
}
