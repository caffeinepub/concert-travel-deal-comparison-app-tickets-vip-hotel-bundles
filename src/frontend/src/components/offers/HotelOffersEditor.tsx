import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Hotel as HotelIcon } from 'lucide-react';
import type { Hotel, RoomType, PriceRange, PriceType } from '@/backend';

interface HotelOffersEditorProps {
  hotels: Hotel[];
  onChange: (hotels: Hotel[]) => void;
}

export default function HotelOffersEditor({ hotels, onChange }: HotelOffersEditorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    country: '',
    starRating: '',
    roomName: '',
    roomPrice: '',
    currency: 'USD',
  });

  const handleAdd = () => {
    if (!formData.name || !formData.city || !formData.country || !formData.roomName || !formData.roomPrice) return;

    const roomType: RoomType = {
      name: formData.roomName,
      price: parseFloat(formData.roomPrice),
      amenities: [],
    };

    const priceRange: PriceRange = {
      minPrice: parseFloat(formData.roomPrice),
      maxPrice: parseFloat(formData.roomPrice),
      currency: formData.currency,
      rateType: ({ perNight: null } as unknown) as PriceType,
    };

    const newHotel: Hotel = {
      name: formData.name,
      address: '',
      city: formData.city,
      country: formData.country,
      starRating: formData.starRating ? parseFloat(formData.starRating) : undefined,
      roomTypes: [roomType],
      amenities: [],
      prices: priceRange,
    };

    if (editingIndex !== null) {
      const updated = [...hotels];
      updated[editingIndex] = newHotel;
      onChange(updated);
      setEditingIndex(null);
    } else {
      onChange([...hotels, newHotel]);
    }

    setFormData({
      name: '',
      city: '',
      country: '',
      starRating: '',
      roomName: '',
      roomPrice: '',
      currency: 'USD',
    });
  };

  const handleEdit = (index: number) => {
    const hotel = hotels[index];
    const room = hotel.roomTypes[0];
    setFormData({
      name: hotel.name,
      city: hotel.city,
      country: hotel.country,
      starRating: hotel.starRating?.toString() || '',
      roomName: room.name,
      roomPrice: room.price.toString(),
      currency: hotel.prices?.currency || 'USD',
    });
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    onChange(hotels.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HotelIcon className="h-5 w-5" />
          Hotel Options *
        </CardTitle>
        <CardDescription>Add hotel pricing from different sources</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hotels.length > 0 && (
          <div className="space-y-2">
            {hotels.map((hotel, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border bg-card"
              >
                <div>
                  <p className="font-medium">{hotel.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {hotel.city}, {hotel.country}
                    {hotel.starRating && ` • ${hotel.starRating}★`} • {hotel.prices?.currency} {hotel.roomTypes[0].price.toFixed(2)}/night
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(index)}>
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-4 pt-4 border-t">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hotelName">Hotel Name</Label>
              <Input
                id="hotelName"
                placeholder="e.g., Marriott Downtown"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hotelCity">City</Label>
              <Input
                id="hotelCity"
                placeholder="e.g., Los Angeles"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hotelCountry">Country</Label>
              <Input
                id="hotelCountry"
                placeholder="e.g., USA"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hotelRating">Star Rating (optional)</Label>
              <Input
                id="hotelRating"
                type="number"
                step="0.5"
                min="0"
                max="5"
                placeholder="e.g., 4.5"
                value={formData.starRating}
                onChange={(e) => setFormData({ ...formData, starRating: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="roomName">Room Type</Label>
              <Input
                id="roomName"
                placeholder="e.g., Standard Double"
                value={formData.roomName}
                onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roomPrice">Price per Night</Label>
              <Input
                id="roomPrice"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.roomPrice}
                onChange={(e) => setFormData({ ...formData, roomPrice: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={handleAdd} variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            {editingIndex !== null ? 'Update Hotel' : 'Add Hotel'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
