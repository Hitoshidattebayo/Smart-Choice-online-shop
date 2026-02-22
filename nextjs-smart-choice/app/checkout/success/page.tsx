import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import CopyButton from '@/components/CopyButton';
import { CheckCircle, Clock } from 'lucide-react';

export default async function SuccessPage({ searchParams }: { searchParams: { ref: string } }) {
    const reference = searchParams.ref;

    if (!reference) {
        return (
            <div className="container py-12 text-center">
                <h1 className="text-2xl font-bold text-red-500">Захиалга олдсонгүй</h1>
                <Link href="/" className="text-blue-500 hover:underline mt-4 block">Нүүр хуудас руу буцах</Link>
            </div>
        );
    }

    const order = await prisma.order.findUnique({
        where: { paymentReference: reference }
    });

    if (!order) {
        return (
            <div className="container py-12 text-center">
                <h1 className="text-2xl font-bold text-red-500">Захиалга олдсонгүй</h1>
                <Link href="/" className="text-blue-500 hover:underline mt-4 block">Нүүр хуудас руу буцах</Link>
            </div>
        );
    }

    const isPaid = order.status === 'PAID';

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isPaid ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    {isPaid ? <CheckCircle size={40} /> : <Clock size={40} />}
                </div>

                <h1 className="text-2xl font-bold mb-2">
                    {isPaid ? 'Төлбөр амжилттай!' : 'Захиалга хүлээн авлаа!'}
                </h1>

                <p className="text-gray-600 mb-8">
                    {isPaid
                        ? 'Таны захиалга баталгаажсан байна. Манай хүргэлтүүд 24 цагийн дотор хүргэгдэх болно.'
                        : 'Таны захиалга үүссэн. Төлбөрөө шилжүүлсний дараа бид тантай холбогдон хүргэлтийг баталгаажуулах болно.'}
                </p>

                <div className="bg-gray-50 p-4 rounded-xl text-left mb-8 border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-500 text-sm">Захиалгын дугаар:</span>
                        <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-lg">{reference}</span>
                            <CopyButton text={reference} label="" />
                        </div>
                    </div>
                    {!isPaid && (order.paymentMethod === 'transfer') && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500 mb-2">Шилжүүлэх дүн:</p>
                            <p className="font-bold text-xl mb-4">{order.totalAmount.toLocaleString()}₮</p>
                            <div className="text-xs text-gray-500 bg-yellow-50 p-2 rounded text-center">
                                Гүйлгээний утга дээр захиалгын дугаарыг бичнэ үү.
                            </div>
                        </div>
                    )}
                </div>

                <Link href="/" className="block w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors">
                    Нүүр хуудас руу буцах
                </Link>
            </div>
        </div>
    );
}
