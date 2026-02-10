import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Plane } from 'lucide-react';

export type TransportMode = 'plane' | 'train' | 'taxi' | 'ground';

export interface TransportOffer {
  id: string;
  mode: TransportMode;
  provider: string;
  classLabel: string;
  price: number;
  currency: string;
}

interface TransportOffersEditorProps {
  transportOffers: TransportOffer[];
  onChange: (offers: TransportOffer[]) => void;
}

export default function TransportOffersEditor({ transportOffers, onChange }: TransportOffersEditorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newOffer, setNewOffer] = useState<Partial<TransportOffer>>({
    mode: 'plane',
    provider: '',
    classLabel: '',
    price: 0,
    currency: 'USD',
  });

  const handleAdd = () => {
    if (!newOffer.provider || !newOffer.classLabel || !newOffer.price) {
      return;
    }
    const offer: TransportOffer = {
      id: Date.now().toString(),
      mode: newOffer.mode as TransportMode,
      provider: newOffer.provider,
      classLabel: newOffer.classLabel,
      price: newOffer.price,
      currency: newOffer.currency || 'USD',
    };
    onChange([...transportOffers, offer]);
    setNewOffer({
      mode: 'plane',
      provider: '',
      classLabel: '',
      price: 0,
      currency: 'USD',
    });
    setIsAdding(false);
  };

  const handleRemove = (id: string) => {
    onChange(transportOffers.filter((o) => o.id !== id));
  };

  const getModeLabel = (mode: TransportMode): string => {
    const labels: Record<TransportMode, string> = {
      plane: 'Flight',
      train: 'Train',
      taxi: 'Taxi',
      ground: 'Ground Transport',
    };
    return labels[mode];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plane className="h-5 w-5" />
          Transportation Options
        </CardTitle>
        <CardDescription>
          Add different transportation options to compare costs (flights, trains, taxis, etc.)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {transportOffers.length === 0 && !isAdding && (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">No transportation options added yet</p>
            <Button onClick={() => setIsAdding(true)} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Transportation
            </Button>
          </div>
        )}

        {transportOffers.map((offer) => (
          <div key={offer.id} className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="flex-1 grid gap-2 md:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground">Mode</p>
                <p className="font-medium">{getModeLabel(offer.mode)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Provider</p>
                <p className="font-medium">{offer.provider}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Class</p>
                <p className="font-medium">{offer.classLabel}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="font-medium">
                  {offer.currency} {offer.price.toFixed(2)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(offer.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {isAdding && (
          <div className="space-y-4 p-4 border-2 rounded-lg bg-accent/5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="mode">Transport Mode *</Label>
                <Select
                  value={newOffer.mode}
                  onValueChange={(value) => setNewOffer({ ...newOffer, mode: value as TransportMode })}
                >
                  <SelectTrigger id="mode">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plane">Flight</SelectItem>
                    <SelectItem value="train">Train</SelectItem>
                    <SelectItem value="taxi">Taxi</SelectItem>
                    <SelectItem value="ground">Ground Transport</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider">Provider/Name *</Label>
                <Input
                  id="provider"
                  placeholder="e.g., Delta Airlines, Amtrak"
                  value={newOffer.provider}
                  onChange={(e) => setNewOffer({ ...newOffer, provider: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="classLabel">Class/Comfort *</Label>
                <Input
                  id="classLabel"
                  placeholder="e.g., Economy, First Class"
                  value={newOffer.classLabel}
                  onChange={(e) => setNewOffer({ ...newOffer, classLabel: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newOffer.price}
                  onChange={(e) => setNewOffer({ ...newOffer, price: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={newOffer.currency}
                  onValueChange={(value) => setNewOffer({ ...newOffer, currency: value })}
                >
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd}>Add Transportation</Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {transportOffers.length > 0 && !isAdding && (
          <Button onClick={() => setIsAdding(true)} variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Another Transportation Option
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
