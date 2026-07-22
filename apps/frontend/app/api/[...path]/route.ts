import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL || "http://localhost:8000";
const HOP_BY_HOP_REQUEST_HEADERS = ["host", "content-length", "connection"];
const HOP_BY_HOP_RESPONSE_HEADERS = ["content-encoding", "content-length", "transfer-encoding", "connection"];

async function handler(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path } = await params;

  // Django (and DRF's router) always expect a trailing slash.
  const targetUrl = new URL(`/api/${(path ?? []).join("/")}/`, API_URL);
  targetUrl.search = request.nextUrl.search;

  const headers = new Headers(request.headers);
  for (const name of HOP_BY_HOP_REQUEST_HEADERS) headers.delete(name);

  const hasBody = !["GET", "HEAD"].includes(request.method);

  const backendResponse = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
    redirect: "manual",
  });

  const responseHeaders = new Headers(backendResponse.headers);
  for (const name of HOP_BY_HOP_RESPONSE_HEADERS) responseHeaders.delete(name);

  return new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    headers: responseHeaders,
  });
}

export { handler as DELETE, handler as GET, handler as PATCH, handler as POST, handler as PUT };
