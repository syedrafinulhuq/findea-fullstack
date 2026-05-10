import { NextRequest, NextResponse } from "next/server";

const apiUrl = () => process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

function authHeader(req: NextRequest) {
  const h = req.headers.get("authorization");
  if (!h) return null;
  return h;
}

export async function GET(req: NextRequest) {
  const auth = authHeader(req);
  if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    const res = await fetch(`${apiUrl()}/api/users/me`, {
      headers: { Authorization: auth },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: "Backend unreachable" }, { status: 503 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = authHeader(req);
  if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  try {
    const res = await fetch(`${apiUrl()}/api/users/me`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: auth },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: "Backend unreachable" }, { status: 503 });
  }
}
