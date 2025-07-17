import { v2 as cloudinary } from "cloudinary";
import { env } from "../../../../../env";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const { timestamp } = await request.json();
  const folder = "sellora";
  try {
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
      },
      env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json({
      signature,
      timestamp,
      apiKey: env.CLOUDINARY_API_KEY,
    });
  } catch (error) {
    console.log();
    return NextResponse.json(
      {
        message: "Error occured while creating signature",
      },
      {
        status: 500,
      }
    );
  }
}
