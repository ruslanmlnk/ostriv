import Link from 'next/link';

export default function CheckoutCancel({ searchParams }: { searchParams?: { orderId?: string } }) {
  const orderId = searchParams?.orderId;

  return (
    <div className="w-full max-w-[1352px] mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-extrabold uppercase text-gray-900 mb-4">Оплату скасовано</h1>
      <p className="text-gray-700 mb-8">
        {orderId ? `Замовлення ${orderId} не оплачено. ` : ''}Ви можете спробувати ще раз.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link
          href="/checkout"
          className="inline-flex items-center justify-center bg-amber-400 text-gray-900 font-bold uppercase px-6 py-3 rounded-sm hover:bg-amber-500 transition-colors"
        >
          Повернутись до checkout
        </Link>
        <Link href="/" className="text-amber-500 underline">
          На головну
        </Link>
      </div>
    </div>
  );
}

