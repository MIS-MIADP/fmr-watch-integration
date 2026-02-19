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
  const v = clean(value);
  if (!v) return null;

  // Remove % if present
  const normalized = v.replace("%", "").trim();

  const n = parseFloat(normalized);
  return isNaN(n) ? null : n;
}

function toDate(value: any): Date | null {
  const v = clean(value);
  if (!v) return null;

  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

function toCommaArray(value: any): string[] {
  const v = clean(value);
  if (!v) return [];
  return v
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function safeJsonParse(value: any): any[] {
  const v = clean(value);
  if (!v) return [];
  try {
    const parsed = JSON.parse(v);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (e) {
    console.warn(`⚠️ Failed to parse JSON: ${v.substring(0, 30)}...`);
    return [];
  }
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
  let progressCreated = 0;
  let progressUpdated = 0;

  for (const row of records) {
    const code = clean(row["Subproject ID"]);
    if (!code) {
      warnings++;
      console.log("⚠️ Skipping row without Subproject ID");
      continue;
    }

    try {
      const geotags = safeJsonParse(row["Geotag"]); //JSON Array Object { id, url, latiture, longiture, timestamp, category }
      const kmlValue = clean(row["KML"]); //string
      const docs = safeJsonParse(row["Documents"]); //JSON Array Object { name, attachment }
      const pows = safeJsonParse(row["POW Details"]); //JSON Array Object { name, attachment, date, target, actual }
      const procs = safeJsonParse(row["Procurement"]); //JSON Array Object { name, url }

      const subprojectData = {
        title: clean(row["Project Name"]) ?? "Title",
        description: clean(row["Description"]),
        status: clean(row["Status"]) ?? "Planned",
        stage: clean(row["Stage"]),

        // Domain
        ancestralDomain: clean(row["Ancestral Domain"]),
        cadtNumber: clean(row["CADT Number"]),

        // Location
        region: clean(row["Region"]),
        province: clean(row["Province"]),
        municipality: clean(row["Municipality"]),
        barangay: clean(row["Barangay"]),
        psgcCode: clean(row["PSGC Code"]),
        latitude: toDecimal(row["Latitude"]),
        longitude: toDecimal(row["Longitude"]),

        // Physical
        proposedLength: toDecimal(row["Prop. Length"]),
        actualLength: toDecimal(row["Act. Length"]),
        designLength: toDecimal(row["Design Length"]),
        unitOfMeasure: clean(row["Unit"]),
        roadClass: clean(row["Road Class"]),
        roadType: clean(row["Road Type"]),

        // Funding
        totalBudget: toDecimal(row["Budget"]),
        approvedBudget: toDecimal(row["ABC"]),
        operatingUnit: clean(row["Operating Unit"]),
        yearFunded: toInt(row["Year"]),
        sourceOfFund: clean(row["Fund"]),

        // Timeline
        contractor: clean(row["Contractor"]),
        duration: toInt(row["Calendar Days"]),
        startDate: toDate(row["Start Date"]),
        endDate: toDate(row["End Date"]),
        targetCompletionDate: toDate(row["Completion Date"]),

        // Arrays
        commodities: toCommaArray(row["Commodities"]),
      };

      const geotagData = geotags.map((g: any) => ({
        externalId: g.id,
        url: g.url,
        latitude: new Prisma.Decimal(g.latitude),
        longitude: new Prisma.Decimal(g.longitude),
        timestamp: new Date(g.timestamp),
        category: g.category,
      }));

      const documentData = docs.map((d: any) => ({
        name: d.name,
        attachment: d.attachment,
      }));

      const powData = pows.map((p: any) => ({
        name: p.name,
        attachment: p.attachment,
        date: p.date,
        target: String(p.target || ""),
        actual: String(p.actual || ""),
      }));

      const procData = procs.map((p: any) => ({
        name: p.name,
        url: p.url,
      }));

      await prisma.subproject.upsert({
  where: { code },
  update: {
    ...subprojectData,
    metadata: {
      upsert: {
        update: {
          kml: kmlValue,
          geotags: { deleteMany: {}, create: geotagData, },
          documents: { deleteMany: {}, create: documentData, },
          powDetails: { deleteMany: {}, create: powData, },
          procurementDetails: { deleteMany: {}, create: procData, },
        },
        create: {
          kml: kmlValue,
          geotags: { create: geotagData, },
          documents: { create: documentData, },
        },
      },
    },
  },
  create: {
    code,
    ...subprojectData,
    metadata: {
      create: {
        kml: kmlValue,
        geotags: { create: geotagData, },
        documents: { create: documentData, },
        powDetails: { create: powData, },
        procurementDetails: { create: procData, },
      },
    },
  },
});

      created++;
    } catch (err) {
      warnings++;
      console.log(`Failed to import ${code}`, err);
    }
  }
  console.log("===================================");
  console.log(`Subprojects Created/Updated: ${created}`);
  console.log(
    `Progress Reports Created: ${progressCreated}, Updated: ${progressUpdated}`,
  );
  console.log(`Warnings: ${warnings}`);
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
