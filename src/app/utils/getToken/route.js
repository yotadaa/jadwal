// 'getToken.js' on the server side
import { NextResponse } from "next/server";
import { verifyToken } from "../auth";

export async function POST(req) {
    return NextResponse.json({ err: '123123' }, { status: 500 });
}
