import { handlers } from "@/auth";

export const GET = handlers.GET;
export const POST = handlers.POST;

// Set the runtime to edge for Cloudflare compatibility
export const runtime = "edge";
