import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createHash, randomUUID } from "crypto";

export async function GET() {
  const key = randomUUID().replace(/-/g, "");

// const hashedKey = createHash('sha256').update(key).digest('hex');
// const inputHash = createHash('sha256').update(hashedKey).digest('hex');

  // await prisma.apiKey.create({
  //   data: {
  //     key,
  //     name: "Development key",
  //     active: true,
  //   }
  // });

  // return NextResponse.json({ apiKey: key, message: "Save this key — it will NOT be shown again!", });
  return NextResponse.json({ message: "Please contact MIS MIADP to request a new API Key.", });
}