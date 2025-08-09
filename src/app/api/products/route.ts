import {
  GetAllProductsActions,
  LicenseType,
  searchQueryProps,
} from "@/app/actions/userActions/ProductActionsUser";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const content = searchParams.get("content");
  const query = searchParams.get("query") || undefined;
  const page = searchParams.get("page");
  const license = searchParams.get("license");

  console.log(content, "Content value");

  try {
    let category: searchQueryProps | undefined = undefined;

    const ValidLicense: Record<string, LicenseType> = {
      freelicense: "free license",
      prolicense: "pro license",
    };

    // Safely map license value
    const licenseValue = license
      ? ValidLicense[license.toLowerCase().replace(/\s+|\+/g, "")] || undefined
      : undefined;

    const validFilters: Record<string, string> = {
      photos: "photo",
      pngs: "png",
      psds: "psd",
      svgs: "svg",
      vectors: "vector",
      templates: "template",
    };

    // Safely map category
    if (content) {
      category = validFilters[content.toLowerCase().replace(/\s+|\+/g, "")] as
        | searchQueryProps
        | undefined;
    }

    console.log({ content, category, license, licenseValue }); // Debugging

    const pageNumber = Math.max(1, parseInt(page || "1", 10)); // Ensure pageNumber is at least 1
    const pageSize = 12;

    const {
      products,
      total,
      page: currentPage,
      totalPages,
    } = await GetAllProductsActions(
      category, // Pass category as searchQuery
      query, // Pass query as query
      pageNumber,
      pageSize,
      licenseValue // Pass licenseValue as license
    );
    //   currentPage: number;
    // totalPages: number;
    // total: number;
    // pageSize: number;

    return NextResponse.json({
      status: 200,
      products,
      paginationData: { currentPage, totalPages, pageSize, total },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { status: false, message: "Error occured, please try again" },
      { status: 500 }
    );
  }
}
