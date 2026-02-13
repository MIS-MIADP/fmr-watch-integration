import { createSwaggerSpec } from "next-swagger-doc";
import { NextResponse } from "next/server";

export async function GET() {
  const spec = createSwaggerSpec({
    // Changed to scan only v1 folder
    apiFolder: "app/api/v1",

    definition: {
      openapi: "3.0.0",
      info: {
        title: "MIAPD Integration to FMR Watch API Keys Service",
        version: "1.0.0",
        description:
          "API service providing secure, key-based access for MIAPD ↔ FMR Watch integration. " +
          "All endpoints require authentication via `x-api-key` header.",
        contact: {
          name: "API Support",
          // email: "support@yourcompany.com",   // optional
        },
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Local development",
        },
        {
          url: "https://fmr-integration.miadp.ph",
          description: "Production",
        },
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