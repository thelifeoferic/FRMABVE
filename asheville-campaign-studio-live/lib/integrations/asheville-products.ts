import type { BrandId, ProductOption } from "@/lib/types/campaign";

const PRODUCT_SOURCE_URL = "https://avldispensary.com/";
const STORE_PRODUCTS_URL = "https://avldispensary.com/wp-json/wc/store/v1/products";

const fallbackProducts: ProductOption[] = [
  {
    id: "delta-9-gummies-feel-good-gummies",
    name: "Delta 9 Gummies - Feel Good Gummies",
    source: "asheville-dispensary",
    category: "Top Sellers",
    price: "From $33",
    url: "https://avldispensary.com/"
  },
  {
    id: "delta-9-seltzer-bliss-10mg",
    name: "Delta 9 Seltzer - Bliss 10mg",
    source: "asheville-dispensary",
    category: "Top Sellers",
    price: "From $5.60",
    url: "https://avldispensary.com/"
  },
  {
    id: "cbd-sleep-gummies-sleepy-time-gummies",
    name: "CBD Sleep Gummies - Sleepy Time Gummies",
    source: "asheville-dispensary",
    category: "Top Sellers",
    price: "From $33",
    url: "https://avldispensary.com/"
  },
  {
    id: "sativa-3-gram-thca-vape-sour-diesel",
    name: "Sativa 3 Gram THCA Vape - Sour Diesel",
    source: "asheville-dispensary",
    category: "Top Sellers",
    price: "$50.00",
    url: "https://avldispensary.com/"
  }
];

const plantBarProducts: ProductOption[] = [
  {
    id: "plant-bar-specialty-coffee",
    name: "Specialty Coffee",
    source: "plant-bar",
    category: "Coffee",
    url: "https://visitplantbar.com/"
  },
  {
    id: "plant-bar-tea-boba",
    name: "Tea & Boba",
    source: "plant-bar",
    category: "Tea",
    url: "https://visitplantbar.com/"
  },
  {
    id: "plant-bar-zero-proof-cocktails",
    name: "Zero-Proof Cocktails",
    source: "plant-bar",
    category: "Bar",
    url: "https://visitplantbar.com/"
  },
  {
    id: "plant-bar-summer-seasonal-menu",
    name: "Summer Seasonal Menu",
    source: "plant-bar",
    category: "Seasonal",
    url: "https://visitplantbar.com/"
  },
  {
    id: "plant-bar-botanical-drinks",
    name: "Botanical Drinks",
    source: "plant-bar",
    category: "Botanical",
    url: "https://visitplantbar.com/"
  }
];

function decodeEntities(value: string) {
  return value
    .replace(/&#8211;|&ndash;/g, "-")
    .replace(/&#038;|&amp;/g, "&")
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type StoreProduct = {
  id: number;
  name: string;
  permalink?: string;
  prices?: {
    price?: string;
    currency_prefix?: string;
    currency_suffix?: string;
    currency_minor_unit?: number;
  };
  categories?: Array<{ name: string }>;
};

function formatStorePrice(product: StoreProduct) {
  const price = product.prices?.price;

  if (!price) return undefined;

  const minorUnit = product.prices?.currency_minor_unit ?? 2;
  const amount = Number(price) / 10 ** minorUnit;
  const prefix = product.prices?.currency_prefix ?? "$";
  const suffix = product.prices?.currency_suffix ?? "";

  return Number.isFinite(amount) ? `${prefix}${amount.toFixed(2)}${suffix}` : undefined;
}

async function getStoreProducts(query: string): Promise<ProductOption[]> {
  const url = new URL(STORE_PRODUCTS_URL);
  url.searchParams.set("per_page", "100");
  url.searchParams.set("page", "1");

  if (query) {
    url.searchParams.set("search", query);
  }

  const response = await fetch(url, {
    next: { revalidate: 900 },
    headers: {
      accept: "application/json",
      "user-agent": "Asheville Campaign Studio product search"
    }
  });

  if (!response.ok) {
    return [];
  }

  const products = (await response.json()) as StoreProduct[];

  return products.map((product) => ({
    id: String(product.id),
    name: decodeEntities(product.name),
    source: "asheville-dispensary" as const,
    category: product.categories?.[0]?.name ? decodeEntities(product.categories[0].name) : "Website",
    price: formatStorePrice(product),
    url: product.permalink
  }));
}

export async function getAshevilleProducts(query = ""): Promise<ProductOption[]> {
  const trimmedQuery = query.trim();

  try {
    const storeProducts = await getStoreProducts(trimmedQuery);

    if (storeProducts.length) {
      return storeProducts;
    }

    const response = await fetch(PRODUCT_SOURCE_URL, {
      next: { revalidate: 3600 },
      headers: {
        "user-agent": "Asheville Campaign Studio product importer"
      }
    });

    if (!response.ok) {
      return fallbackProducts;
    }

    const html = await response.text();
    const matches = Array.from(html.matchAll(/<h2[^>]*>\s*<a[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>\s*<\/h2>/gi));
    const products = matches
      .map((match) => {
        const name = decodeEntities(match[2]);
        const surrounding = html.slice(match.index ?? 0, (match.index ?? 0) + 900);
        const priceMatch = surrounding.match(/(?:From:)?\s*\$[0-9]+(?:\.[0-9]{2})?/);
        const categoryMatch = surrounding.match(/<a[^>]*rel="tag"[^>]*>(.*?)<\/a>/i);

        return {
          id: slugify(name),
          name,
          source: "asheville-dispensary" as const,
          category: categoryMatch ? decodeEntities(categoryMatch[1]) : "Website",
          price: priceMatch ? priceMatch[0].replace("From:", "From ").trim() : undefined,
          url: match[1]
        };
      })
      .filter((product) => product.name && !product.name.toLowerCase().includes("shop all"));

    const deduped = Array.from(new Map(products.map((product) => [product.id, product])).values());
    const filtered = trimmedQuery
      ? deduped.filter((product) => product.name.toLowerCase().includes(trimmedQuery.toLowerCase()))
      : deduped;

    return filtered.length ? filtered.slice(0, 100) : fallbackProducts;
  } catch {
    return fallbackProducts;
  }
}

export async function getProductsForBrand(brandId: BrandId, query = ""): Promise<ProductOption[]> {
  if (brandId === "plant-bar") {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return plantBarProducts;
    }

    const filtered = plantBarProducts.filter((product) =>
      [product.name, product.category].some((value) => value?.toLowerCase().includes(normalizedQuery))
    );

    return filtered.length ? filtered : plantBarProducts;
  }

  return getAshevilleProducts(query);
}
