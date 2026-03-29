import { Clock, Truck, MapPin } from "lucide-react";

// Нэг бүлэг өгөгдөл
const ItemGroup = () => (
    <>
        <div className="flex items-center gap-4 shrink-0">
            <Clock size={22} />
            <span className="font-bold tracking-widest uppercase text-sm">24 цагийн дотор</span>
        </div>
        <div className="flex items-center gap-4 shrink-0">
            <Truck size={22} />
            <span className="font-bold tracking-widest uppercase text-sm">Хот дотор хүргэлт үнэгүй</span>
        </div>
        <div className="flex items-center gap-4 shrink-0">
            <MapPin size={22} />
            <span className="font-bold tracking-widest uppercase text-sm">Орон нутагт хүргэлт хийнэ</span>
        </div>
    </>
);

// Тус бүлгээ олон дахин давтсан нэг том хэсэг (дэлгэцийг дүүргэх хэмжээний урттай)
const SingleSlide = () => (
    <div className="flex items-center gap-[150px] px-[75px]">
        <ItemGroup />
        <ItemGroup />
        <ItemGroup />
        <ItemGroup />
    </div>
);

export default function DeliveryInfoBar() {
    return (
        <div className="bg-[var(--color-dark-bg)] text-[var(--color-accent-gold)] py-4 overflow-hidden whitespace-nowrap border-b border-white/10 flex w-full">
            {/* 80s duration ensures it's extremely slow, and duplicating SingleSlide ensures an infinite seamless loop */}
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused]" style={{ animationDuration: '80s' }}>
                <SingleSlide /> {/* Эхний хагас */}
                <SingleSlide /> {/* Хоёр дахь хагас (яг ижил) */}
            </div>
        </div>
    );
}
