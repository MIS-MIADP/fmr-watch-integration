import { NextResponse } from "next/server";
import { withApiKey } from "@/lib/api-key-middleware";
import { prisma } from "@/lib/prisma";

/**
 * @swagger
 * /api/v1/miadp-fmr:
 *   get:
 *     summary: Get Subprojects (FMR Watch Integration)
 *     description: |
 *       Protected endpoint for MIADP ↔ FMR Watch integration.
 *       Returns a list of subprojects ordered by creation date (latest first).
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
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 12
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2026-02-13T08:30:00.000Z
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: 9c3d6c2a-1f2e-4f10-8c72-7fbc0f9b7c11
 *                       code:
 *                         type: string
 *                         example: FMR-2026-001
 *                       title:
 *                         type: string
 *                         example: Farm-to-Market Road Improvement
 *
 *                       ancestralDomain:
 *                         type: string
 *                         nullable: true
 *                         example: CADT Area Name
 *                       cadtNumber:
 *                         type: string
 *                         nullable: true
 *                         example: CADT-1234
 *                       location:
 *                         type: string
 *                         nullable: true
 *                         example: Barangay San Isidro
 *
 *                       description:
 *                         type: string
 *                         nullable: true
 *                       scopeOfWorks:
 *                         type: string
 *                         nullable: true
 *
 *                       targetLength:
 *                         type: number
 *                         format: decimal
 *                         nullable: true
 *                         example: 1.25
 *                       unitOfMeasure:
 *                         type: string
 *                         nullable: true
 *                         example: km
 *
 *                       sourceOfFund:
 *                         type: string
 *                         nullable: true
 *                         example: DA-MIADP
 *                       yearFunded:
 *                         type: integer
 *                         nullable: true
 *                         example: 2026
 *                       totalBudget:
 *                         type: number
 *                         format: decimal
 *                         nullable: true
 *                         example: 1500000
 *                       approvedBudget:
 *                         type: number
 *                         format: decimal
 *                         nullable: true
 *                         example: 1450000
 *
 *                       implementingAgency:
 *                         type: string
 *                         nullable: true
 *                       contractor:
 *                         type: string
 *                         nullable: true
 *
 *                       latitude:
 *                         type: number
 *                         format: decimal
 *                         nullable: true
 *                         example: 7.1907083
 *                       longitude:
 *                         type: number
 *                         format: decimal
 *                         nullable: true
 *                         example: 125.4553417
 *
 *                       duration:
 *                         type: integer
 *                         nullable: true
 *                         example: 120
 *                       startDate:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                       targetCompletionDate:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                       actualCompletionDate:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *
 *                       status:
 *                         type: string
 *                         example: Planned
 *
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *
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
 *
 *       403:
 *         description: API key is deactivated
 *
 *       500:
 *         description: Failed to fetch subprojects
 */
export async function GET(request: Request) {
  // 1. Authenticate with Middleware
  const authError = await withApiKey(request as any);
  if (authError) return authError;

  try {
    // 2. Fetch data from the database
    const subprojects = await prisma.subproject.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 3. Return the response
    return NextResponse.json({
      success: true,
      count: subprojects.length,
      timestamp: new Date().toISOString(),
      data: subprojects,
    });
    
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subprojects" },
      { status: 500 }
    );
  }
}