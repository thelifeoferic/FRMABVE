import { NextResponse } from "next/server";
import { getAlpineAudienceResult } from "@/lib/integrations/alpine-iq";

export async function GET() {
  const result = await getAlpineAudienceResult();
  return NextResponse.json(result);
}
