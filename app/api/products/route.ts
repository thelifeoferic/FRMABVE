import { NextResponse } from "next/server";
import { getProductsForBrand } from "@/lib/integrations/asheville-products";
import type { BrandId } from "@/lib/types/campaign";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? "";
  const brand = (url.searchParams.get("brand") || "asheville-dispensary") as BrandId;
  const products = await getProductsForBrand(brand, query);

  return NextResponse.json({ products });
}
