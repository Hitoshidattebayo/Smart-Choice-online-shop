import { Clock, Truck, MapPin } from "lucide-react";

export default function DeliveryInfoBar() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '3rem',
            marginBottom: '4rem',
            flexWrap: 'wrap',
            color: 'var(--color-text-light)',
            fontSize: '1.1rem',
            fontWeight: 500
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <Clock size={24} />
                <span>24 цагийн дотор</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <Truck size={24} />
                <span>Хот дотор хүргэлт үнэгүй</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <MapPin size={24} />
                <span>Хөдөө орон нутгийн унаанд тавьж явуулах боломжтой</span>
            </div>
        </div>
    );
}
