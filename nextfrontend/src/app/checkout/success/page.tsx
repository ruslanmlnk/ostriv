import Link from 'next/link';

export default function CheckoutSuccess({
  searchParams,
}: {
  searchParams?: { orderId?: string; session_id?: string };
}) {
  const orderId = searchParams?.orderId;

  return (
    <div className="w-full max-w-[1352px] mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-extrabold uppercase text-gray-900 mb-4">Оплату успішно виконано</h1>
      <p className="text-gray-700 mb-8">
        Дякуємо за покупку{orderId ? `! Номер замовлення: ${orderId}` : '!'}
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center bg-amber-400 text-gray-900 font-bold uppercase px-6 py-3 rounded-sm hover:bg-amber-500 transition-colors"
        >
          На головну
        </Link>
        <Link href="/checkout" className="text-amber-500 underline">
          Повернутись до оформлення
        </Link>
      </div>
    </div>
  );
}

