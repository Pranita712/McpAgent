import { z } from "zod";

export const CreateTemplateSchema = {
  templateName: z.string().describe("Name of the template to create"),
  sObject: z.string().describe("Salesforce object name (e.g., Account, Contact)"),
  recordCount: z.number().min(1).max(300000).describe("Number of records to generate"),
  outputFormats: z.array(z.enum(["csv", "json", "di"])).describe("Output formats"),
  fieldsToExclude: z.array(z.string()).optional().describe("Fields to exclude from generation"),
  fieldsToConsider: z.record(z.array(z.string())).optional().describe("Specific field values to consider"),
};

// zod schema for type inference
export const CreateTemplateZodSchema = z.object(CreateTemplateSchema);

// inferred TypeScript type for handler args
export type CreateTemplateArgs = z.infer<typeof CreateTemplateZodSchema>;

// validate-template
export const ValidateTemplateSchema = {
  templateName: z.string().describe("Name of the template to validate"),
  aliasOrUsername: z.string().describe("Salesforce org alias or username")
};
// zod schema for type inference
export const ValidateTemplateZodSchema = z.object(ValidateTemplateSchema);
export type ValidateTemplateArgs = z.infer<typeof ValidateTemplateZodSchema>;

// generate-data
export const GenerateDataSchema = {
  templateName: z.string().describe("Name of the template to use"),
  aliasOrUsername: z.string().describe("Salesforce org alias or username")
};
// zod schema for type inference
export const GenerateDataZodSchema = z.object(GenerateDataSchema);
export type GenerateDataArgs = z.infer<typeof GenerateDataZodSchema>;

// upload-data
export const UploadDataSchema = {
  fileName: z.string().describe("File to upload (.csv or .json)"),
  aliasOrUsername: z.string().describe("Salesforce org alias or username"),
  sObject: z.string().describe("Salesforce object name")
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
  templateName: z.string().describe("Name of the template to print")
};
export const PrintTemplateZodSchema = z.object(PrintTemplateSchema);
export type PrintTemplateArgs = z.infer<typeof PrintTemplateZodSchema>;

//upsert template 
export const UpsertTemplateSchema = {
  templateName: z.string().describe("Name of the template to update"),
  sObject: z.string().optional().describe("Salesforce object name"),
  recordCount: z.number().min(1).max(300000).optional().describe("Number of records to generate"),
  namespaceToExclude: z.string().optional().describe("Namespace to exclude"),
  outputFormat: z.string().optional().describe("Output format (e.g., json, csv, di)"),
  fieldsToExclude: z.string().optional().describe("Comma-separated fields to exclude"),
  fieldsToConsider: z.string().optional().describe("JSON string of fields and values to consider"),
  pickLeftFields: z.string().optional().describe("Fields to pick on the left (true/false)")
};
export const UpsertTemplateZodSchema = z.object(UpsertTemplateSchema);
export type UpsertTemplateArgs = z.infer<typeof UpsertTemplateZodSchema>;

// remove template
export const RemoveTemplateSchema = {
  templateName: z.string().describe("Name of the template to modify"),
  sObject: z.string().optional().describe("Salesforce object name"),
  recordCount: z.number().min(1).max(300000).optional().describe("Number of records to generate"),
  namespaceToExclude: z.string().optional().describe("Namespace to exclude"),
  outputFormat: z.string().optional().describe("Output format (e.g., json, csv, di)"),
  fieldsToExclude: z.string().optional().describe("Comma-separated fields to exclude"),
  fieldsToConsider: z.string().optional().describe("JSON string of fields and values to consider"),
  pickLeftFields: z.string().optional().describe("Fields to pick on the left (true/false)")
};
export const RemoveTemplateZodSchema = z.object(RemoveTemplateSchema);
export type RemoveTemplateArgs = z.infer<typeof RemoveTemplateZodSchema>;



