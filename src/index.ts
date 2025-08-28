#!/usr/bin/env node

import express, { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

import {
  CreateTemplateSchema,
  CreateTemplateArgs,
  ValidateTemplateSchema,
  ValidateTemplateArgs,
  GenerateDataSchema,
  GenerateDataArgs,
  PrintTemplateSchema,
  PrintTemplateArgs,
  RemoveTemplateSchema,
  RemoveTemplateArgs,
  UploadDataSchema,
  UploadDataArgs,
  UpsertTemplateSchema,
  UpsertTemplateArgs,
} from "./schemas/createTemplateSchema.js";

import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs/promises";
import * as path from "path";

const execAsync = promisify(exec);

// ------------------ Helper functions ------------------

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

async function executeSmockitCommand(command: string): Promise<string> {
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stderr) console.error(`Command stderr: ${stderr}`);
    return stdout.trim();
  } catch (error: any) {
    console.error(`Command execution failed: ${command}`);
    throw new Error(
      `Failed to execute Smock-it command: ${getErrorMessage(error)}`
    );
  }
}

async function readTemplateFile(templateName: string): Promise<any> {
  const templatePath = path.join(
    process.cwd(),
    "data_gen",
    "templates",
    `${templateName}.json`
  );
  const content = await fs.readFile(templatePath, "utf-8");
  return JSON.parse(content);
}

async function writeTemplateFile(
  templateName: string,
  template: any
): Promise<void> {
  const templateDir = path.join(process.cwd(), "data_gen", "templates");
  await fs.mkdir(templateDir, { recursive: true });
  const templatePath = path.join(templateDir, `${templateName}.json`);
  await fs.writeFile(templatePath, JSON.stringify(template, null, 2));
}

// ------------------ Create MCP server ------------------

function createServer() {
  const server = new McpServer({
    name: "my-mcp-server",
    version: "1.0.0",
    capabilities: { resources: {}, tools: {} },
  });

  // ------------------ Register tools ------------------

  server.tool(
    "create-template",
    "Create a new Smock-it template for test data generation",
    CreateTemplateSchema,
    async (args: CreateTemplateArgs) => {
      const {
        templateName,
        sObject,
        recordCount,
        outputFormats,
        fieldsToExclude,
        fieldsToConsider,
      } = args;
      try {
        const template = {
          namespaceToExclude: ["testGen"],
          outputFormat: outputFormats,
          count: recordCount,
          sObjects: [
            {
              [sObject.toLowerCase()]: {
                count: recordCount,
                fieldsToExclude: fieldsToExclude || [],
                fieldsToConsider: fieldsToConsider || {},
                pickLeftFields: true,
              },
            },
          ],
        };
        await writeTemplateFile(templateName, template);
        return {
          content: [
            {
              type: "text",
              text: `Template '${templateName}' created successfully.`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error creating template: ${getErrorMessage(error)}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "validate-template",
    "Validate a Smock-it template against Salesforce org",
    ValidateTemplateSchema,
    async (args: ValidateTemplateArgs) => {
      const { templateName, aliasOrUsername } = args;
      try {
        const command = `sf smockit template validate -t ${templateName} -a ${aliasOrUsername}`;
        const result = await executeSmockitCommand(command);
        return {
          content: [
            { type: "text", text: `Template validation result:\n${result}` },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Template validation failed: ${getErrorMessage(error)}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "generate-data",
    "Generate test data using Smock-it template",
    GenerateDataSchema,
    async (args: GenerateDataArgs) => {
      const { templateName, aliasOrUsername } = args;
      try {
        try {
          await executeSmockitCommand(`sf org display -o ${aliasOrUsername}`);
        } catch {
          await executeSmockitCommand(`sf org login web -a ${aliasOrUsername}`);
        }
        const command = `sf smockit data generate -t ${templateName} -a ${aliasOrUsername}`;
        const result = await executeSmockitCommand(command);
        return {
          content: [
            { type: "text", text: `Data generation completed:\n${result}` },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Data generation failed: ${getErrorMessage(error)}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "upload-data",
    "Upload generated data to Salesforce org",
    UploadDataSchema,
    async (args: UploadDataArgs) => {
      const { fileName, aliasOrUsername, sObject } = args;
      try {
        try {
          await executeSmockitCommand(`sf org display -o ${aliasOrUsername}`);
        } catch {
          await executeSmockitCommand(`sf org login web -a ${aliasOrUsername}`);
        }
        const command = `sf smockit data upload -u ${fileName} -a ${aliasOrUsername} -s ${sObject}`;
        const result = await executeSmockitCommand(command);
        return {
          content: [
            { type: "text", text: `Data upload completed:\n${result}` },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Data upload failed: ${getErrorMessage(error)}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "print-template",
    "Print the contents of a Smock-it template in read-only mode",
    PrintTemplateSchema,
    async (args: PrintTemplateArgs) => {
      const { templateName } = args;
      try {
        const command = `sf smockit template print -t ${templateName}`;
        const result = await executeSmockitCommand(command);
        return {
          content: [
            { type: "text", text: `Template print output:\n${result}` },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error printing template: ${getErrorMessage(error)}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "upsert-template",
    "Upsert configuration into an existing Smock-it template",
    UpsertTemplateSchema,
    async (args: UpsertTemplateArgs) => {
      const {
        templateName,
        sObject,
        recordCount,
        namespaceToExclude,
        outputFormat,
        fieldsToExclude,
        fieldsToConsider,
        pickLeftFields,
      } = args;
      try {
        const flags = [
          `-t ${templateName}`,
          sObject ? `-s ${sObject}` : "",
          recordCount ? `-c ${recordCount}` : "",
          namespaceToExclude ? `-x ${namespaceToExclude}` : "",
          outputFormat ? `-f ${outputFormat}` : "",
          fieldsToExclude ? `-e ${fieldsToExclude}` : "",
          pickLeftFields ? `-p ${pickLeftFields}` : "",
        ]
          .filter(Boolean)
          .join(" ");

        let command = `sf smockit template upsert ${flags}`;
        if (fieldsToConsider) {
          let fieldsArg = fieldsToConsider;
          if (typeof fieldsToConsider === "object") {
            const entries = Object.entries(fieldsToConsider).map(([k, v]) => {
              if (Array.isArray(v)) {
                return `${k}: [${v.join(",")}]`;
              } else if (typeof v === "string") {
                return `${k}: ${v}`;
              } else {
                return `${k}: ${JSON.stringify(v)}`;
              }
            });
            fieldsArg = `{${entries.join(", ")}}`;
          }
          if (
            typeof fieldsArg === "string" &&
            fieldsArg.startsWith('"') &&
            fieldsArg.endsWith('"')
          ) {
            fieldsArg = fieldsArg.slice(1, -1);
          }
          command += ` --fieldsToConsider "${fieldsArg}"`;
        }
        const result = await executeSmockitCommand(command);
        return {
          content: [
            { type: "text", text: `Template upsert output:\n${result}` },
          ],
        };
      } catch (error) {
        return {
          content: [
            { type: "text", text: `Upsert failed: ${getErrorMessage(error)}` },
          ],
        };
      }
    }
  );

  server.tool(
    "remove-template-config",
    "Remove specific config from a Smock-it template",
    RemoveTemplateSchema,
    async (args: RemoveTemplateArgs) => {
      const {
        templateName,
        sObject,
        recordCount,
        namespaceToExclude,
        outputFormat,
        fieldsToExclude,
        fieldsToConsider,
        pickLeftFields,
      } = args;
      try {
        const flags = [
          `-t ${templateName}`,
          sObject ? `-s ${sObject}` : "",
          recordCount ? `-c ${recordCount}` : "",
          namespaceToExclude ? `-x ${namespaceToExclude}` : "",
          outputFormat ? `-f ${outputFormat}` : "",
          fieldsToExclude ? `-e ${fieldsToExclude}` : "",
          fieldsToConsider ? `-i ${fieldsToConsider}` : "",
          pickLeftFields ? `-p ${pickLeftFields}` : "",
        ]
          .filter(Boolean)
          .join(" ");

        const command = `sf smockit template remove ${flags}`;
        const result = await executeSmockitCommand(command);
        return {
          content: [{ type: "text", text: `Remove config output:\n${result}` }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Remove config failed: ${getErrorMessage(error)}`,
            },
          ],
        };
      }
    }
  );

  return server;
}

// ------------------ Start HTTP MCP server ------------------

//async function main() {
const app = express();

// Optional: parse JSON if needed
app.use(express.json());
// Health check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});
// Wire transport handler to Express route
app.post("/mcp", async (req: Request, res: Response) => {
  try {
    // Create MCP server instance
    const server = createServer();
    // Create transport
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    res.on("close", () => {
      console.log("Response closed");
      transport.close();
      server.close();
    });

    // Connect MCP server to transport
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("");
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: "-32603",
          message: "Internal server error",
        },
        id: "null",
      });
    }
  }
});

//Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`MCP Streamable HTTP server listening at ${PORT}`);
});
