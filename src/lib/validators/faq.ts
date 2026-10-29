import { z } from "zod";

export const faqSchema = z.object({
  question: z.string().trim().min(1, "Pertanyaan wajib diisi"),
  answer: z.string().trim().min(1, "Jawaban wajib diisi"),
  sort_order: z.coerce.number().int().default(0),
  is_published: z.boolean().default(false),
});

export type FaqInput = z.infer<typeof faqSchema>;
