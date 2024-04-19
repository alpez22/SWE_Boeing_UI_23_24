import { z } from "zod";

const addLineSchema = z.object({
  lineId: z.string(),
  installationDate: z.number(),
  wasteRate: z.number(),
  weight: z.number()
});

export default addLineSchema;