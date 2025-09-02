import { z } from "zod";

export const CreateTemplateSchema = {
  templateName: z
    .string()
    .describe(
      "Name of the template (e.g., 'AccountTemplate'). If missing, AI should ask the user to provide one."
    ),
  sObject: z
    .string()
    .describe("Salesforce object name (e.g., Account, Contact)"),
  recordCount: z
    .number()
    .min(1)
    .max(300000)
    .describe(
      "Number of records to generate. If missing, AI should ask how many records the user wants."
    ),
  outputFormats: z
    .array(z.enum(["csv", "json", "di"]))
    .describe(
      "Output formats for records generation. If missing, AI should ask whether to keep all formats or only specific one."
    ),
  fieldsToExclude: z
    .array(z.string())
    .optional()
    .describe(
      "Fields to exclude from generation. If missing, AI should ask whether any fields need to be excluded. If provided, pickLeftFields is usually true (include others except excluded)"
    ),
  fieldsToConsider: z
    .record(z.array(z.string()))
    .optional()
    .describe(
      "Specific fields and their possible values to include. If missing, AI should ask whether to include all fields or only specific ones. If user specifies only certain fields (like Name, Email), pickLeftFields should be false"
    ),
};

// zod schema for type inference
export const CreateTemplateZodSchema = z.object(CreateTemplateSchema);

// inferred TypeScript type for handler args
export type CreateTemplateArgs = z.infer<typeof CreateTemplateZodSchema>;

// validate-template
export const ValidateTemplateSchema = {
  templateName: z
    .string()
    .describe(
      "Name of the template (e.g., 'AccountTemplate') to validate. If missing, AI should ask the user to provide one."
    ),
  aliasOrUsername: z
    .string()
    .describe(
      "Salesforce org alias or username to validate against. If missing, AI should ask the user for it."
    ),
};
// zod schema for type inference
export const ValidateTemplateZodSchema = z.object(ValidateTemplateSchema);
export type ValidateTemplateArgs = z.infer<typeof ValidateTemplateZodSchema>;

// generate-data
export const GenerateDataSchema = {
  templateName: z
    .string()
    .describe(
      "Name of the template to use for data generation. If missing, AI should ask the user for it."
    ),
  aliasOrUsername: z
    .string()
    .describe(
      "Salesforce org alias or username to run the data generation in. If missing, AI should ask the user for it."
    ),
};
// zod schema for type inference
export const GenerateDataZodSchema = z.object(GenerateDataSchema);
export type GenerateDataArgs = z.infer<typeof GenerateDataZodSchema>;

// upload-data
export const UploadDataSchema = {
  fileName: z.string().describe("File to upload (.json)"),
  aliasOrUsername: z
    .string()
    .describe(
      "Salesforce org alias or username to run the data uploading. If missing, AI should ask the user for it."
    ),
  sObject: z.string().describe("Salesforce object name"),
};
export const UploadDataZodSchema = z.object(UploadDataSchema);
export type UploadDataArgs = z.infer<typeof UploadDataZodSchema>;

// get-template-details
// export const GetTemplateDetailsSchema = {
//   templateName: z.string().describe("Name of the template to inspect")
// };
// export const GetTemplateDetailsZodSchema = z.object(GetTemplateDetailsSchema);
// export type GetTemplateDetailsArgs = z.infer<typeof GetTemplateDetailsZodSchema>;

//print template
export const PrintTemplateSchema = {
  templateName: z
    .string()
    .describe(
      "Name of the template to print. If missing, AI should ask the user for it."
    ),
};
export const PrintTemplateZodSchema = z.object(PrintTemplateSchema);
export type PrintTemplateArgs = z.infer<typeof PrintTemplateZodSchema>;

//upsert template
export const UpsertTemplateSchema = {
  templateName: z
    .string()
    .describe(
      "Name of the template to update. If not provided, AI should ask the user for one."
    ),
  sObject: z
    .string()
    .optional()
    .describe(
      "Salesforce object name. If missing, AI should ask if a specific object should be targeted."
    ),
  recordCount: z
    .number()
    .min(1)
    .max(300000)
    .optional()
    .describe("Number of records to generate."),
  namespaceToExclude: z.string().optional().describe("Namespace to exclude"),
  outputFormat: z
    .string()
    .optional()
    .describe("Output format (e.g., json, csv, di)"),
  fieldsToExclude: z
    .string()
    .optional()
    .describe(
      "Comma-separated fields to exclude. If provided, pickLeftFields is usually true (include others except excluded)"
    ),
  fieldsToConsider: z
    .string()
    .optional()
    .describe(
      "JSON string of fields and values to consider. If user specifies only certain fields (like Name, Email), pickLeftFields should be false."
    ),
  pickLeftFields: z
    .boolean()
    .optional()
    .describe(
      "Whether to include all remaining fields not mentioned in fieldsToExclude or fieldsToConsider (true/false)"
    ),
};
export const UpsertTemplateZodSchema = z.object(UpsertTemplateSchema);
export type UpsertTemplateArgs = z.infer<typeof UpsertTemplateZodSchema>;

// remove template
export const RemoveTemplateSchema = {
  templateName: z.string().describe("Name of the template to modify"),
  sObject: z.string().optional().describe("Salesforce object name"),
  recordCount: z
    .number()
    .min(1)
    .max(300000)
    .optional()
    .describe("Number of records to generate"),
  namespaceToExclude: z.string().optional().describe("Namespace to exclude"),
  outputFormat: z
    .string()
    .optional()
    .describe("Output format (e.g., json, csv, di)"),
  fieldsToExclude: z
    .string()
    .optional()
    .describe("Comma-separated fields to exclude"),
  fieldsToConsider: z
    .string()
    .optional()
    .describe("JSON string of fields and values to consider"),
  pickLeftFields: z
    .boolean()
    .optional()
    .describe(
      "Whether to include all remaining fields not mentioned in fieldsToExclude or fieldsToConsider (true/false)"
    ),
};
export const RemoveTemplateZodSchema = z.object(RemoveTemplateSchema);
export type RemoveTemplateArgs = z.infer<typeof RemoveTemplateZodSchema>;
