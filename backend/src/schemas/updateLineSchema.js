import { z } from "zod";

const updateLineSchema = z.object({
  wasteRate: z.number(),
  weight: z.number(),
});

export default updateLineSchema;