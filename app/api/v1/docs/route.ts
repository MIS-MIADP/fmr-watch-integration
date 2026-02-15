import { createSwaggerSpec } from "next-swagger-doc";
import { NextResponse } from "next/server";
import path from "path";

export async function GET() {
  const spec = createSwaggerSpec({
    apiFolder: path.join("app", "api", "v1"),
    apiFilePattern: "**/*.ts",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "MIAPD Integration to FMR Watch API Keys Service",
        version: "1.0.0",
        description:
          "API service providing secure, key-based access for MIAPD ↔ FMR Watch integration. " +
          "All endpoints require authentication via `x-api-key` header.",
        contact: {
          name: "MIADP MIS Team",
          email: "mis.miadp@gmail.com",  
        },
      },
      servers: [
        {
          url: "https://miadp-fmr-integration.vercel.app",
          description: "Vercel Production",
        },
        // {
        //   url: "http://localhost:3000",
        //   description: "Local development",
        // },
        // {
        //   url: "https://fmr-integration.miadp.ph",
        //   description: "MIADP Production Server",
        // }
      ],
      components: {
        securitySchemes: {
          ApiKeyAuth: {
            type: "apiKey",
            in: "header",
            name: "x-api-key",
            description:
              "API key required for all endpoints. Obtain from your integration dashboard or seed endpoint.",
          },
        },
      },
      // Applies global security – every endpoint will require the key unless you override it
      security: [{ ApiKeyAuth: [] }],
      // Optional: define global tags for better grouping in UI
      tags: [
        {
          name: "FMR Watch Integration",
          description: "Endpoints specific to MIAPD ↔ FMR Watch data exchange",
        },
        {
          name: "Health & Status",
          description: "Basic health checks and diagnostics",
        },
      ],
    },
  });

  return NextResponse.json(spec);
}