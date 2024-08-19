import { NextRequest } from "next/server"
import { getAllPost } from "../../lib/data"

export async function GET(request: NextRequest) {
    const endCursor = request.nextUrl.searchParams.get('endCursor')
    return Response.json(await getAllPost(endCursor));
}