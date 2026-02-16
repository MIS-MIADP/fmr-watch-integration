import { PrismaClient, Prisma } from "../generated/prisma/client";
import csvParser from "csv-parser";
import fs from "fs";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

console.log("DATABASE_URL:", process.env.DATABASE_URL);
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

function clean(value: any): string | null {
  if (value === undefined || value === null) return null;
  const v = String(value).trim();
  if (!v || v.toLowerCase() === "n/a" || v === "-") return null;
  return v;
}

function toInt(value: any): number | null {
  const v = clean(value);
  if (!v) return null;
  const n = parseInt(v);
  return isNaN(n) ? null : n;
}

function toDecimal(value: any): Prisma.Decimal | null {
  const v = clean(value);
  if (!v) return null;

  // remove ₱ and commas
  const normalized = v.replace(/[₱,]/g, "");
  const n = Number(normalized);

  if (isNaN(n)) return null;
  return new Prisma.Decimal(n);
}

function toFloat(value: any): number | null {
  const v = clean(value)
  if (!v) return null

  // Remove % if present
  const normalized = v.replace("%", "").trim()

  const n = parseFloat(normalized)
  return isNaN(n) ? null : n
}


function toDate(value: any): Date | null {
  const v = clean(value);
  if (!v) return null;

  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

async function seedFromCsv(csvPath: string) {
  console.log("=== Starting Subproject CSV seed ===");

  const records: any[] = [];
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csvParser())
      .on("data", (row) => records.push(row))
      .on("end", () => resolve())
      .on("error", reject);
  });

  console.log(`Found ${records.length} rows`);

  let created = 0;
  let warnings = 0;
  let progressCreated = 0
  let progressUpdated = 0

  for (const row of records) {
    const code = clean(row["Subproject ID"]);
    if (!code) {
      warnings++;
      console.log("⚠️ Skipping row without Subproject ID");
      continue;
    }

    try {
      const title = clean(row["Title"]) ?? "";
      const ancestralDomain = clean(row["Ancestral Domain"]);
      const cadtNumber = clean(row["CADT Number"]);
      const region = clean(row["Region"]);
      const province = clean(row["Province"]);
      const municipality = clean(row["Municipality"]);
      const barangay = clean(row["Barangay"]);
      const description = clean(row["Subproject Description"]);
      const scopeOfWorks = clean(row["Scope of Works"]);
      const targetLength = toDecimal(row["Target Length"]);
      const unitOfMeasure = clean(row["Unit of Measure"]);
      const sourceOfFund = clean(row["Source of Fund"]);
      const yearFunded = toInt(row["Year Funded"]);
      const totalBudget = toDecimal(row["Total Budget"]);
      const approvedBudget = toDecimal( row["Approved Budget for Contract (ABC)"], );
      const implementingAgency = clean(row["Implementing Agency (LGU/PLGU)"]);
      const contractor = clean(row["Contractor"]);
      const latitude = toDecimal(row["Latitude"]);
      const longitude = toDecimal(row["Longitutde"]);
      const duration = toInt(row["Duration"]);
      const startDate = toDate(row["Start Date"]);
      const targetCompletionDate = toDate(row["Target Completion Date"]);
      const actualCompletionDate = toDate(row["Actual Completion Date"]);
      const status = clean(row["Status"]);

      const reportDate = toDate(clean(row["As of Report Date"]))
      const targetProgress = toFloat(clean(row["Target Progress %"]))
      const actualProgress = toFloat(clean(row["Actual Progress %"]))

      const dataInput = {
          title,
          ancestralDomain,
          cadtNumber,
          region,
          province,
          municipality,
          barangay,
          description,
          scopeOfWorks,
          targetLength,
          unitOfMeasure,
          sourceOfFund,
          yearFunded,
          totalBudget,
          approvedBudget,
          implementingAgency,
          contractor,
          latitude,
          longitude,
          duration,
          startDate,
          targetCompletionDate,
          actualCompletionDate,
          status,
      }

      const subproject = await prisma.subproject.upsert({
        where: { code },
        update: dataInput,
        create: {
          code,
          ...dataInput
        },
      });

      created++;

if (reportDate) {
        const existingReport = await prisma.progressReport.findUnique({
          where: {
            subprojectId_reportDate: {
              subprojectId: subproject.id,
              reportDate,
            },
          },
        })

        if (existingReport) {
          await prisma.progressReport.update({
            where: { id: existingReport.id },
            data: { targetProgress, actualProgress },
          })
          progressUpdated++
        } else {
          await prisma.progressReport.create({
            data: {
              subprojectId: subproject.id,
              reportDate,
              targetProgress,
              actualProgress,
            },
          })
          progressCreated++
        }
      }


    } catch (err) {
      warnings++;
      console.log(`Failed to import ${code}`, err);
    }
  }
  console.log("===================================");
  console.log(`Subprojects Created/Updated: ${created}`)
  console.log(`Progress Reports Created: ${progressCreated}, Updated: ${progressUpdated}`)
  console.log(`Warnings: ${warnings}`)
}

async function main() {
  const csvFile = "./.config/prisma/seeder/data/subproject.csv";
  try {
    await seedFromCsv(csvFile);
  } catch (e) {
    console.error("Seed failed:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
