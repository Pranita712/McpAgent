// #!/usr/bin/env node

// import { Client } from "@modelcontextprotocol/sdk/client/index.js";
// import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// async function main() {
//   // start your MCP server externally, or do spawn if needed
//   const transport = new StdioClientTransport({
//     command: "node",
//     args: ["build/index.js"]
//   });

//   const client = new Client({
//     name: "my-mcp-test-client",
//     version: "1.0.0"
//   });

//   await client.connect(transport);

//   // list tools to confirm it connects
//   const tools = await client.listTools();
//   console.log("Available tools:", tools);

//   // call the create-template tool
//  const result = await client.callTool({
//       name: "create-template", // The name of the tool to call
//       arguments: { // The actual arguments for the 'create-template' tool, matching its Zod schema
//         templateName: "testTemplate",
//         sObject: "Account",
//         recordCount: 10,
//         outputFormats: ["csv", "json"]
//       }
//     });
//   console.log("create-template result:", JSON.stringify(result, null, 2));

//   await client.disconnect();
// }

// main().catch(err => {
//   console.error("Error:", err);
//   process.exit(1);
// });

// test-client.ts
// import { Client } from "@modelcontextprotocol/sdk/client/index.js";
// import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// async function main() {
//   // Initialize the StdioClientTransport, which will spawn your server process.
//   // Ensure 'build/index.js' is the correct path to your compiled server code.
//   const transport = new StdioClientTransport({
//     command: "node",
//     args: ["build/index.js"]
//   });

//   // Initialize the MCP Client.
//   const client = new Client({
//     name: "my-mcp-test-client",
//     version: "1.0.0"
//   });

//   // Connect the client to the transport. This action will start the server process.
//   await client.connect(transport);
//   console.log("Client connected to MCP server.");

//   try {
//     // List available tools to confirm the connection and server capabilities.
//     const tools = await client.listTools();
//     console.log("Available tools:", tools);

//     // Call the 'create-template' tool.
//     // Note: The MCP SDK's type definitions for `callTool` expect a single object
//     // with 'name' and 'arguments' properties, even if some documentation examples
//     // might show a simpler string-then-object signature. This structure resolves
//     // the TypeScript error.
//     const result = await client.callTool({
//       name: "create-template", // The name of the tool to call
//       arguments: { // The actual arguments for the 'create-template' tool, matching its Zod schema
//         templateName: "testTemplate",
//         sObject: "Account",
//         recordCount: 10,
//         outputFormats: ["csv", "json"]
//       }
//     });

//     console.log("create-template result:", JSON.stringify(result, null, 2));
//     const validateResult = await client.callTool({
//       name: "validate-template",
//       arguments: {
//         templateName: "testTemplate",
//         aliasOrUsername: "testOrg"
//       }
//     });
//     console.log("validate-template result:", JSON.stringify(validateResult, null, 2));

//     // 3️ generate-data
//     const generateResult = await client.callTool({
//       name: "generate-data",
//       arguments: {
//         templateName: "testTemplate",
//         aliasOrUsername: "testOrg"
//       }
//     });
//     console.log("generate-data result:", JSON.stringify(generateResult, null, 2));

//     // 4️ upload-data
//     const uploadResult = await client.callTool({
//       name: "upload-data",
//       arguments: {
//         fileName: "output/testTemplate.csv",
//         aliasOrUsername: "testOrg",
//         sObject: "Account"
//       }
//     });
//     console.log("upload-data result:", JSON.stringify(uploadResult, null, 2));

//     // 5️ list-templates
//     const listTemplatesResult = await client.callTool({
//       name: "list-templates",
//       arguments: {}
//     });
//     console.log("list-templates result:", JSON.stringify(listTemplatesResult, null, 2));

//     // 6️ get-template-details
//     const getDetailsResult = await client.callTool({
//       name: "get-template-details",
//       arguments: {
//         templateName: "testTemplate"
//       }
//     });
//     console.log(" get-template-details result:", JSON.stringify(getDetailsResult, null, 2));


//   } catch (err: unknown) {
//     // Catch and log any errors that occur during client operations.
//     console.error("Error during client operation:", getErrorMessage(err));
//   } finally {
//     // Disconnect the transport to gracefully terminate the server process.
//     // The `Client` instance itself does not have a `disconnect` method;
//     // connection management is handled by the `transport`.
//     if (transport && typeof transport.close === 'function') {
//       transport.close();
//       console.log("Client transport disconnected.");
//     } else {
//       console.log("Transport does not have a close method or is not initialized.");
//     }
//   }
// }

// // Helper function to safely extract an error message from an unknown error type.
// function getErrorMessage(error: unknown): string {
//   if (error instanceof Error) return error.message;
//   return String(error);
// }

// // Execute the main function and handle any unhandled rejections.
// main().catch(err => {
//   console.error("Fatal Error in main:", err);
//   process.exit(1);
// });
