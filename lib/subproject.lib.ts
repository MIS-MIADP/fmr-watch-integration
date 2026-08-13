import { fetchTSVSheet } from "@/lib/gsheet-fetcher.lib"

export type TInfraSubproject = {
  id: string
  projectName: string
  description: string
  status: string
  ancestralDomain: string
  cadtNumber: string
  region: string
  province: string
  municipality: string
  barangay: string
  psgcCode: string
  latitude: string
  longitude: string
  budget: string
  abc: string
  operatingUnit: string
  year: string
  stage: string
  subprojectStatus: string
  contractor: string
  proposedLength: string
  actualLength: string
  designLength: string
  unit: string
  roadClass: string
  roadType: string
  calendarDays: string
  revisedCalendarDays: string
  startDate: string
  targetCompletionDate: string
  revisedTargetCompletionDate: string
  endDate: string
  fund: string
  commodities: string
  geotag: string
  documents: string
  powDetails: string
  procurement: string
  kml: string
}

export type TNormalizedSubproject = {
  id: string
  code: string
  title: string
  description: string | null
  status: string
  stage: string | null

  // Domain Information
  ancestralDomain: string | null
  cadtNumber: string | null

  // Location Details
  region: string | null
  province: string | null
  municipality: string | null
  barangay: string | null
  psgcCode: string | null
  latitude: number | null
  longitude: number | null

  // Physical Details
  proposedLength: number | null
  actualLength: number | null
  designLength: number | null
  unitOfMeasure: string | null
  roadClass: string | null
  roadType: string | null

  // Funding
  sourceOfFund: string | null
  yearFunded: number | null
  totalBudget: number | null
  approvedBudget: number | null
  operatingUnit: string | null

  // Implementation
  contractor: string | null
  duration: number | null
  revisedDuration: number | null
  startDate: string | null
  endDate: string | null
  targetCompletionDate: string | null
  revisedTargetCompletionDate: string | null
  commodities: string[]

  // Metadata
  metadata: {
    kml: string | null
    geotags: any[]
    documents: any[]
    powDetails: any[]
    procurementDetails: any[]
  }
}

function parseDecimal(val: string): number | null {
  if (!val) return null
  return parseFloat(val.replace(/,/g, ""))
}


// Normalizer function
function normalizeSubproject(item: TInfraSubproject): TNormalizedSubproject {
  return {
    id: item.id,
    code: item.id, 
    title: item.projectName,
    description: item.description || null,
    status: item.status,
    stage: item.stage || null,

    ancestralDomain: item.ancestralDomain || null,
    cadtNumber: item.cadtNumber || null,

    region: item.region || null,
    province: item.province || null,
    municipality: item.municipality || null,
    barangay: item.barangay || null,
    psgcCode: item.psgcCode || null,
    latitude: parseDecimal(item.latitude),
    longitude: parseDecimal(item.longitude),

    proposedLength: parseDecimal(item.proposedLength),
    actualLength: parseDecimal(item.actualLength),
    designLength: parseDecimal(item.designLength),
    unitOfMeasure: item.unit || null,
    roadClass: item.roadClass || null,
    roadType: item.roadType || null,

    sourceOfFund: item.fund || null,
    yearFunded: parseInt(item.year) || null,
    totalBudget: parseDecimal(item.budget),
    approvedBudget: parseDecimal(item.abc),
    operatingUnit: item.operatingUnit || null,

    contractor: item.contractor || null,
    duration: parseInt(item.calendarDays) || null,
    revisedDuration: parseInt(item.revisedCalendarDays) || null,
    startDate: item.startDate ? new Date(item.startDate).toISOString() : null,
    endDate: item.endDate ? new Date(item.endDate).toISOString() : null,
    targetCompletionDate: item.targetCompletionDate ? new Date(item.targetCompletionDate).toISOString() : null,
    revisedTargetCompletionDate: item.revisedTargetCompletionDate ? new Date(item.revisedTargetCompletionDate).toISOString() : null,
    commodities: item.commodities ? item.commodities.split(",").map(c => c.trim()) : [],

    metadata: {
      kml: item.kml || null,
      geotags: [], // parse if sheet provides JSON
      documents: [],
      powDetails: [],
      procurementDetails: []
    }
  }
}


export async function fetchGoogleSheetInfraSubprojects() {
  const url = process.env.FMR_LIST_GSHEET ?? ""

  const raw = await fetchTSVSheet<TInfraSubproject>(
    url,
    item => ({
      id: item["Subproject ID"],
      projectName: item["Project Name"],
      description: item["Description"],
      status: item["Status"],
      ancestralDomain: item["Ancestral Domain"],
      cadtNumber: item["CADT Number"],
      region: item["Region"],
      province: item["Province"],
      municipality: item["Municipality"],
      barangay: item["Barangay"],
      psgcCode: item["PSGC Code"],
      latitude: item["Latitude"],
      longitude: item["Longitude"],
      budget: item["Budget"],
      abc: item["ABC"],
      operatingUnit: item["Operating Unit"],
      year: item["Year"],
      stage: item["Stage"],
      subprojectStatus: item["Subproject Status"],
      contractor: item["Contractor"],
      proposedLength: item["Prop. Length"],
      actualLength: item["Act. Length"],
      designLength: item["Design Length"],
      unit: item["Unit"],
      roadClass: item["Road Class"],
      roadType: item["Road Type"],
      calendarDays: item["Calendar Days"],
      revisedCalendarDays: item["Revised Days"],
      startDate: item["Start Date"],
      targetCompletionDate: item["Target Completion Date"],
      revisedTargetCompletionDate: item["Revised Target Completion Date"],
      endDate: item["End Date"],
      fund: item["Fund"],
      commodities: item["Commodities"],
      geotag: item["Geotag"],
      documents: item["Documents"],
      powDetails: item["POW Details"],
      procurement: item["Procurement"],
      kml: item["KML"]
    }),
    {
      range: "A1:AM",
      dataRowStart: 1
    }
  )


  return raw.map(normalizeSubproject)
}
