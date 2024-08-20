export async function GET() {
    const data = await fetch(
        "https://pub-3db3ed9313c4427fadfa81f0323b18f8.r2.dev/latest.json",
    ).then((res) => res.json());
    return Response.json(data);
}
