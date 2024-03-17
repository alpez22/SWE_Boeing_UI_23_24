import { z } from "zod";

const addLineSchema = z.object({
  lineId: z.number(),
  installationDate: z.number(),
  wasteRate: z.number()

});

export default addLineSchema;