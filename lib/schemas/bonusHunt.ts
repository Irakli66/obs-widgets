import { z } from "zod";

export const bonusHuntSchema = z.object({
  name: z.string().min(1, "Hunt name is required"),
  startBalance: z
    .number({
      required_error: "Start balance is required",
      invalid_type_error: "Start balance must be a number",
    })
    .min(1, "Start balance must be at least 1"),
});

export const bonusSchema = z.object({
  name: z.string().min(1, "bonus name is required"),
  betSize: z.number().min(0, "bet amount is required"),
});
