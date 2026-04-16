import { z } from "zod";

export const GetCloudinarySignatureSchema = z.object({
  folder: z.string().min(1, "Folder is required").default("mediconnect/profiles"),
});
