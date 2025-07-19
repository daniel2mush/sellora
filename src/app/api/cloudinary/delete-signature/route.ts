import { v2 as cloudinary } from "cloudinary";
import { env } from "../../../../../env";
import { NextResponse } from "next/server";
import z, { string } from "zod";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const deleteParamsValidation = z.object({
  public_id: z.string(),
  timestamp: z.number(),
});

export async function POST(request: Request) {
  const { timestamp, public_id } = await request.json();
  const validated = deleteParamsValidation.parse({
    public_id,
    timestamp,
  });
  try {
    const signature = cloudinary.utils.api_sign_request(
      {
        public_id: validated.public_id,
        timestamp: validated.timestamp,
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
