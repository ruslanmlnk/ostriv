import { NextResponse } from 'next/server';
import { getNpJwt } from '@/lib/novapostJwt';

const BASE = 'https://api.novapost.com/v.1.0';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const settlementId = (searchParams.get('settlementId') || '').trim();
  if (!settlementId) return NextResponse.json({ warehouses: [] });

  const jwt = await getNpJwt();

  const url = new URL(`${BASE}/divisions`);
  url.searchParams.append('countryCodes[]', 'UA');
  url.searchParams.set('limit', '200');
  url.searchParams.set('page', '1');
  url.searchParams.append('settlementIds[]', settlementId); // ключове! :contentReference[oaicite:5]{index=5}

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${jwt}`,
      Accept: 'application/json',
      'Accept-Language': 'uk',
    },
    cache: 'no-store',
  });

  const data = await res.json();
  const items = data?.items || [];

  const warehouses = items.map((d: any) => ({
    id: d.id,
    name: d.name,
    address: d.address,
    number: d.number,
    divisionCategory: d.divisionCategory,
  }));

  return NextResponse.json({ warehouses });
}
