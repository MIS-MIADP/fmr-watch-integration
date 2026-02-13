import { PrismaClient, Prisma } from '../generated/prisma/client'
import csvParser from "csv-parser"
import fs from "fs"
import "dotenv/config"
import { PrismaPg } from '@prisma/adapter-pg';

console.log("DATABASE_URL:", process.env.DATABASE_URL)
const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
});
const prisma = new PrismaClient({ adapter });

function clean(value: any): string | null {
  if (value === undefined || value === null) return null
  const v = String(value).trim()
  if (!v || v.toLowerCase() === "n/a" || v === "-") return null
  return v
}

function toInt(value: any): number | null {
  const v = clean(value)
  if (!v) return null
  const n = parseInt(v)
  return isNaN(n) ? null : n
}

function toDecimal(value: any): Prisma.Decimal | null {
  const v = clean(value)
  if (!v) return null

  // remove ₱ and commas
  const normalized = v.replace(/[₱,]/g, "")
  const n = Number(normalized)

  if (isNaN(n)) return null
  return new Prisma.Decimal(n)
}

function toDate(value: any): Date | null {
  const v = clean(value)
  if (!v) return null

  const d = new Date(v)
  return isNaN(d.getTime()) ? null : d
}

async function seedFromCsv(csvPath: string) {

  console.log("=== Starting Subproject CSV seed ===")

  const records: any[] = []
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csvParser())
      .on("data", row => records.push(row))
      .on("end", () => resolve())
      .on("error", reject)
  })

  console.log(`Found ${records.length} rows`)

  let created = 0
  let warnings = 0

  for (const row of records) {
    const code = clean(row["Subproject ID"])
    if (!code) {
      warnings++
      console.log("⚠️ Skipping row without Subproject ID")
      continue
    }

    try {
      await prisma.subproject.upsert({
        where: { code },
        update: {
          title: clean(row["Title"]) ?? "",
          ancestralDomain: clean(row["Ancestral Domain"]),
          cadtNumber: clean(row["CADT Number"]),
          location: clean(row["Location"]),
          description: clean(row["Subproject Description"]),
          scopeOfWorks: clean(row["Scope of Works"]),

          targetLength: toDecimal(row["Target Length"]),
          unitOfMeasure: clean(row["Unit of Measure"]),

          sourceOfFund: clean(row["Source of Fund"]),
          yearFunded: toInt(row["Year Funded"]),
          totalBudget: toDecimal(row["Total Budget"]),
          approvedBudget: toDecimal(row["Approved Budget"]),

          implementingAgency: clean(row["Implementing Agency"]),
          contractor: clean(row["Contractor"]),

          latitude: toDecimal(row["Latitude"]),
          longitude: toDecimal(row["Longitutde"]),

          duration: toInt(row["Duration"]),
          startDate: toDate(row["Start Date"]),
          targetCompletionDate: toDate(row["Target Completion Date"]),
          actualCompletionDate: toDate(row["Actual Completion Date"]),

          status: clean(row["Status"]),
        },
        create: {
          code,
          title: clean(row["Title"]) ?? "",
          ancestralDomain: clean(row["Ancestral Domain"]),
          cadtNumber: clean(row["CADT Number"]),
          location: clean(row["Location"]),
          description: clean(row["Subproject Description"]),
          scopeOfWorks: clean(row["Scope of Works"]),

          targetLength: toDecimal(row["Target Length"]),
          unitOfMeasure: clean(row["Unit of Measure"]),

          sourceOfFund: clean(row["Source of Fund"]),
          yearFunded: toInt(row["Year Funded"]),
          totalBudget: toDecimal(row["Total Budget"]),
          approvedBudget: toDecimal(row["Approved Budget"]),

          implementingAgency: clean(row["Implementing Agency"]),
          contractor: clean(row["Contractor"]),

          latitude: toDecimal(row["Latitude"]),
          longitude: toDecimal(row["Longitutde"]),

          duration: toInt(row["Duration"]),
          startDate: toDate(row["Start Date"]),
          targetCompletionDate: toDate(row["Target Completion Date"]),
          actualCompletionDate: toDate(row["Actual Completion Date"]),

          status: clean(row["Status"]),
        },
      })

      created++
    } catch (err) {
      warnings++
      console.log(`Failed to import ${code}`, err)
    }
  }
  console.log("===================================")
  console.log(`Created/Updated: ${created}`)
  console.log(`Warnings: ${warnings}`)
}

async function main() {
  const csvFile = "./.config/prisma/seeder/data/subproject.csv" 
  try {
    await seedFromCsv(csvFile)
  } catch (e) {
    console.error("Seed failed:", e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
