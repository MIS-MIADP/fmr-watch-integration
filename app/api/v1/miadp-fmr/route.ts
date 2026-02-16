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
 *       Returns a list of subprojects with their progress reports.
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
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       code:
 *                         type: string
 *                       title:
 *                         type: string
 *                       ancestralDomain:
 *                         type: string
 *                         nullable: true
 *                       cadtNumber:
 *                         type: string
 *                         nullable: true
 *                       location:
 *                         type: string
 *                         nullable: true
 *                       description:
 *                         type: string
 *                         nullable: true
 *                       targetLength:
 *                         type: number
 *                         format: decimal
 *                         nullable: true
 *                       unitOfMeasure:
 *                         type: string
 *                         nullable: true
 *                       sourceOfFund:
 *                         type: string
 *                         nullable: true
 *                       yearFunded:
 *                         type: integer
 *                         nullable: true
 *                       totalBudget:
 *                         type: number
 *                         format: decimal
 *                         nullable: true
 *                       approvedBudget:
 *                         type: number
 *                         format: decimal
 *                         nullable: true
 *                       implementingAgency:
 *                         type: string
 *                         nullable: true
 *                       contractor:
 *                         type: string
 *                         nullable: true
 *                       latitude:
 *                         type: number
 *                         format: decimal
 *                         nullable: true
 *                       longitude:
 *                         type: number
 *                         format: decimal
 *                         nullable: true
 *                       duration:
 *                         type: integer
 *                         nullable: true
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
 *                       scopeOfWorks:
 *                         type: string
 *                         nullable: true
 *                       status:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       progressReports:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               format: uuid
 *                             reportDate:
 *                               type: string
 *                               format: date
 *                               nullable: true
 *                             targetProgress:
 *                               type: number
 *                               format: float
 *                               nullable: true
 *                             actualProgress:
 *                               type: number
 *                               format: float
 *                               nullable: true
 *       401:
 *         description: Missing or invalid API key
 *       403:
 *         description: API key is deactivated
 *       500:
 *         description: Failed to fetch subprojects
 */

export async function GET(request: Request) {
  const authError = await withApiKey(request as any);
  if (authError) return authError;

  try {
    const subprojects = await prisma.subproject.findMany({
      include: { progressReports: true },
      orderBy: {
        code: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      count: subprojects.length,
      timestamp: new Date().toISOString(),
      data: subprojects,
    })
    
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subprojects" },
      { status: 500 }
    );
  }
}
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}