import db from '../../../db';

export const dynamic = 'force-dynamic';
export async function GET() {
  const lastUpdate = await db.metric.findFirst({
    orderBy: {
      timestamp: 'desc',
    },
  });

  return Response.json({
    lastUpdate,
  });
}
