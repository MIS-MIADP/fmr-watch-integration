import { NextResponse } from "next/server";
import { withApiKey } from "@/lib/api-key-middleware";
import { prisma } from "@/lib/prisma";

/**
 * @swagger
 * /api/v1/miadp-fmr:
 *   get:
 *     summary: Get Subprojects (FMR Watch Integration)
 *     description: Returns MIADP FMR subprojects including geotags, POW, procurement and documents.
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
 *                 count:
 *                   type: integer
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Subproject'
 *       401:
 *         description: Missing or invalid API key
 *       500:
 *         description: Failed to fetch subprojects
 */
export async function GET(request: Request) {
  const authError = await withApiKey(request as any);
  if (authError) return authError;

  try {
    const subprojects = await prisma.subproject.findMany({
      include: {
        metadata: {
          include: {
            geotags: true,
            documents: true,
            powDetails: true,
            procurementDetails: true,
          },
        },
      },
      orderBy: {
        code: 'desc',
      },
    });

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

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}