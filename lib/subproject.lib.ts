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
  description: string
  status: string
  stage: string
  region: string
  province: string
  municipality: string
  barangay: string
  psgcCode: string
  latitude: number
  longitude: number
  proposedLength: number
  actualLength: number
  designLength: number
  unitOfMeasure: string
  sourceOfFund: string
  yearFunded: number
  totalBudget: number
  approvedBudget: number
  contractor: string
  duration: number | null
  revisedDuration: number
  startDate: string | null
  endDate: string | null
  targetCompletionDate: string | null
  revisedTargetCompletionDate: string | null
  commodities: string[]
  metadata: {
    kml: string
    geotags: any[]
    documents: any[]
    powDetails: any[]
    procurementDetails: any[]
  }
}

// Normalizer function
function normalizeSubproject(item: TInfraSubproject): TNormalizedSubproject {
  return {
    id: item.id,
    code: item.cadtNumber ?? "",
    title: item.projectName,
    description: item.description,
    status: item.status,
    stage: item.stage,
    region: item.region,
    province: item.province,
    municipality: item.municipality,
    barangay: item.barangay,
    psgcCode: item.psgcCode,
    latitude: parseFloat(item.latitude) || 0,
    longitude: parseFloat(item.longitude) || 0,
    proposedLength: parseFloat(item.proposedLength) || 0,
    actualLength: parseFloat(item.actualLength) || 0,
    designLength: parseFloat(item.designLength) || 0,
    unitOfMeasure: item.unit,
    sourceOfFund: item.fund,
    yearFunded: parseInt(item.year) || 0,
    totalBudget: parseFloat(item.budget.replace(/,/g, "")) || 0,
    approvedBudget: parseFloat(item.abc.replace(/,/g, "")) || 0,
    contractor: item.contractor,
    duration: parseInt(item.calendarDays) || 0,
    revisedDuration: parseInt(item.revisedCalendarDays) || 0,
    startDate: item.startDate ? new Date(item.startDate).toISOString() : null,
    endDate: item.endDate ? new Date(item.endDate).toISOString() : null,
    targetCompletionDate: item.targetCompletionDate ? new Date(item.targetCompletionDate).toISOString() : null,
    revisedTargetCompletionDate: item.revisedTargetCompletionDate ? new Date(item.revisedTargetCompletionDate).toISOString() : null,
    commodities: item.commodities ? item.commodities.split(",").map(c => c.trim()) : [],
    metadata: {
      kml: item.kml,
      geotags: [],
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
      range: "A1:AK",
      dataRowStart: 1
    }
  )


  return raw.map(normalizeSubproject)
}
