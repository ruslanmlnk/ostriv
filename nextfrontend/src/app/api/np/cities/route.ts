import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const apiKey = process.env.NOVAPOSHTA_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        modelName: 'Address',
        calledMethod: 'getCities',
        apiKey: apiKey,
      }),
      // Кешування на 24 години
      next: { revalidate: 86400 },
    });

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json(
        { error: 'Failed to fetch cities' },
        { status: 500 }
      );
    }

    // Оптимізація даних - залишаємо тільки необхідні поля
    const optimizedData = data.data.map((city: any) => ({
      value: city.Description,
      valueRu: city.DescriptionRu,
      label: city.Description,
      labelRu: city.DescriptionRu,
      ref: city.Ref,
    }));

    return NextResponse.json(
      { success: true, data: optimizedData },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}