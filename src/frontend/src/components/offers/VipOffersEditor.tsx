import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import type { VIPPackage } from '@/backend';

interface VipOffersEditorProps {
  vipPackages: VIPPackage[];
  onChange: (vipPackages: VIPPackage[]) => void;
}

export default function VipOffersEditor({ vipPackages, onChange }: VipOffersEditorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    currency: 'USD',
    inclusions: '',
    exclusivePerks: '',
  });

  const handleAdd = () => {
    if (!formData.name || !formData.price) return;

    const newPackage: VIPPackage = {
      id: BigInt(Date.now()),
      name: formData.name,
      price: parseFloat(formData.price),
      currency: formData.currency,
      inclusions: formData.inclusions.split('\n').filter((s) => s.trim()),
      exclusivePerks: formData.exclusivePerks || undefined,
    };

    if (editingIndex !== null) {
      const updated = [...vipPackages];
      updated[editingIndex] = newPackage;
      onChange(updated);
      setEditingIndex(null);
    } else {
      onChange([...vipPackages, newPackage]);
    }

    setFormData({ name: '', price: '', currency: 'USD', inclusions: '', exclusivePerks: '' });
  };

  const handleEdit = (index: number) => {
    const pkg = vipPackages[index];
    setFormData({
      name: pkg.name,
      price: pkg.price.toString(),
      currency: pkg.currency,
      inclusions: pkg.inclusions.join('\n'),
      exclusivePerks: pkg.exclusivePerks || '',
    });
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    onChange(vipPackages.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          VIP Packages (Optional)
        </CardTitle>
        <CardDescription>Add official VIP packages if available</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {vipPackages.length > 0 && (
          <div className="space-y-2">
            {vipPackages.map((pkg, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border bg-card"
              >
                <div>
                  <p className="font-medium">{pkg.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {pkg.currency} {pkg.price.toFixed(2)} • {pkg.inclusions.length} inclusions
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
              <Label htmlFor="vipName">Package Name</Label>
              <Input
                id="vipName"
                placeholder="e.g., Platinum VIP Experience"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vipPrice">Price</Label>
              <Input
                id="vipPrice"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="vipInclusions">Inclusions (one per line)</Label>
            <Textarea
              id="vipInclusions"
              placeholder="Early venue entry&#10;Meet & greet&#10;Exclusive merchandise"
              rows={4}
              value={formData.inclusions}
              onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vipPerks">Exclusive Perks (optional)</Label>
            <Input
              id="vipPerks"
              placeholder="e.g., Backstage tour"
              value={formData.exclusivePerks}
              onChange={(e) => setFormData({ ...formData, exclusivePerks: e.target.value })}
            />
          </div>
          <Button onClick={handleAdd} variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            {editingIndex !== null ? 'Update Package' : 'Add VIP Package'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
