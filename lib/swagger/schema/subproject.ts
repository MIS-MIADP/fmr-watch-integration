/**
 * @swagger
 * components:
 *   schemas:
 *     Geotag:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         externalId:
 *           type: string
 *           nullable: true
 *         url:
 *           type: string
 *         latitude:
 *           type: number
 *           format: double
 *         longitude:
 *           type: number
 *           format: double
 *         timestamp:
 *           type: string
 *           format: date-time
 *         category:
 *           type: string
 *           nullable: true
 *
 *     Document:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         attachment:
 *           type: string
 *
 *     PowDetail:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         attachment:
 *           type: string
 *         date:
 *           type: string
 *           nullable: true
 *           example: "02-15-2025"
 *         target:
 *           type: string
 *           nullable: true
 *         actual:
 *           type: string
 *           nullable: true
 *
 *     ProcurementDetail:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         url:
 *           type: string
 *
 *     Metadata:
 *       type: object
 *       properties:
 *         kml:
 *           type: string
 *           nullable: true
 *         geotags:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Geotag'
 *         documents:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Document'
 *         powDetails:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PowDetail'
 *         procurementDetails:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProcurementDetail'
 *
 *     Subproject:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         code:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           example: Planned
 *         stage:
 *           type: string
 *           nullable: true
 *
 *         region:
 *           type: string
 *           nullable: true
 *         province:
 *           type: string
 *           nullable: true
 *         municipality:
 *           type: string
 *           nullable: true
 *         barangay:
 *           type: string
 *           nullable: true
 *         psgcCode:
 *           type: string
 *           nullable: true
 *
 *         latitude:
 *           type: number
 *           format: double
 *           nullable: true
 *         longitude:
 *           type: number
 *           format: double
 *           nullable: true
 *
 *         proposedLength:
 *           type: number
 *           nullable: true
 *         actualLength:
 *           type: number
 *           nullable: true
 *         designLength:
 *           type: number
 *           nullable: true
 *         unitOfMeasure:
 *           type: string
 *           nullable: true
 *
 *         sourceOfFund:
 *           type: string
 *           nullable: true
 *         yearFunded:
 *           type: integer
 *           nullable: true
 *         totalBudget:
 *           type: number
 *           nullable: true
 *         approvedBudget:
 *           type: number
 *           nullable: true
 *
 *         contractor:
 *           type: string
 *           nullable: true
 *         duration:
 *           type: integer
 *           nullable: true
 *
 *         startDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         endDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         targetCompletionDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *
 *         commodities:
 *           type: array
 *           items:
 *             type: string
 *
 *         metadata:
 *           $ref: '#/components/schemas/Metadata'
 */
