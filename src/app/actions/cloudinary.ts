"use server";

import axios from "axios";
import { env } from "../../../env";

export async function getSignature(timestamp: number, public_id: string) {
  if (!timestamp)
    return {
      status: false,
      message: "There is no timestamp, please provide a timestamp",
    };

  try {
    const res = await axios.post(
      `${env.NEXT_PUBLIC_API_URL}/api/cloudinary/signature`,
      { timestamp, public_id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.data) {
      return {
        status: false,
        message: res.statusText,
      };
    }
    return {
      status: true,
      data: res.data,
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: "Error occured while connecting to the backend",
    };
  }
}

export async function getDeleteSignature({
  timestamp,
  public_id,
}: {
  timestamp: number;
  public_id: string;
}) {
  if (!timestamp)
    return {
      status: false,
      message: "There is no timestamp, please provide a timestamp",
    };

  try {
    const res = await axios.post(
      `${env.NEXT_PUBLIC_API_URL}/api/cloudinary/delete-signature`,
      { timestamp, public_id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.data) {
      return {
        status: false,
        message: res.statusText,
      };
    }
    return {
      status: true,
      data: res.data,
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: "Error occured while connecting to the backend",
    };
  }
}
