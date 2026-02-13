import { NextResponse } from "next/server";
import { withApiKey } from "@/lib/api-key-middleware";

/**
 * @swagger
 * /api/v1/miadp-fmr:
 *   get:
 *     summary: FMR Watch Hello Endpoint
 *     description: |
 *       Simple protected test endpoint for MIAPD ↔ FMR Watch integration.
 *       Returns a greeting with current server timestamp.
 *     tags:
 *       - FMR Watch Integration
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello from protected API!
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2026-02-13T08:30:00.000Z
 *       401:
 *         description: Missing or invalid API key
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid API key
 *       403:
 *         description: API key is deactivated
 */
export async function GET(request: Request) {
  const authError = await withApiKey(request as any);
  if (authError) return authError;
  return NextResponse.json({
    message: "Hello from protected API!",
    timestamp: new Date().toISOString(),
  });
}