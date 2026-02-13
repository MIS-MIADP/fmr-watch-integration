import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function withApiKey(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");

  if (!apiKey) 
    return NextResponse.json( { error: "x-api-key header is required" }, { status: 401 } );
  
  const keyRecord = await prisma.apiKey.findUnique({ where: { key: apiKey }, });

  if (!keyRecord) 
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  

  if (!keyRecord.active) 
    return NextResponse.json({ error: "API key is deactivated" }, { status: 403 });
  

  await prisma.apiKey.update({ where: { id: keyRecord.id }, data: { lastUsed: new Date() }, });

  return null; 
}