import { Ratelimit } from "@upstash/ratelimit";
import redis from "../../utils/redis";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export const runtime = 'edge';
const ratelimit = redis
  ? new Ratelimit({
    redis: redis,
    limiter: Ratelimit.fixedWindow(4, "1440 m"),
    analytics: true,
  })
  : undefined;


export async function POST(request: Request) {
  // Rate Limiter Code
  if (ratelimit) {
    const headersList = headers();
    const ipIdentifier = headersList.get("x-real-ip");

    const result = await ratelimit.limit(ipIdentifier ?? "");

    if (!result.success) {
      return NextResponse.json(
        "Too many uploads in 1 day. Please try again in 24 hours.",
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": result.limit,
            "X-RateLimit-Remaining": result.remaining,
          } as any,
        }
      );
    }
  }

  const { imageUrl, productDescription } = await request.json();

  // POST request to Replicate to start the image restoration generation process
  let startResponse = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + process.env.REPLICATE_API_KEY,
    },
    body: JSON.stringify({
      version: process.env.REPLICATE_VERSION,
      input: {
        image_path: imageUrl,
        image_num: 3,
        prompt: productDescription,
        api_key: process.env.OPEN_AI_API_KEY,
        negative_prompt: 'illustration, 3d, sepia, painting, cartoons, sketch, (worst quality:2)',

      },
    }),
  });
  if (startResponse.status !== 201) {
    return NextResponse.json(
      "Failed to generate image",
      { status: 500 }
    );
  }

  let jsonStartResponse = await startResponse.json();
  let endpointUrl = jsonStartResponse.urls.get;
  let restoredImage: string | null = null;
  
  while (!restoredImage) {
    let finalResponse = await fetch(endpointUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + process.env.REPLICATE_API_KEY,
      },
    });
    let jsonFinalResponse = await finalResponse.json();

    if (jsonFinalResponse.status === "succeeded") {
      restoredImage = jsonFinalResponse.output;
    } else if (jsonFinalResponse.status === "failed") {
      break;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return NextResponse.json(
    restoredImage ? restoredImage : "Failed to restore image",
  );
}
