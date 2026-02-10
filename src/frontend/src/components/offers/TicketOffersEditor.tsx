import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Ticket as TicketIcon } from 'lucide-react';
import type { Ticket, TicketType } from '@/backend';

interface TicketOffersEditorProps {
  tickets: Ticket[];
  onChange: (tickets: Ticket[]) => void;
}

function getTicketTypeLabel(type: TicketType): string {
  if ('standard' in (type as any)) return 'Standard';
  if ('vip' in (type as any)) return 'VIP';
  return 'Unknown';
}

function getTicketTypeValue(type: TicketType): 'standard' | 'vip' {
  if ('standard' in (type as any)) return 'standard';
  return 'vip';
}

export default function TicketOffersEditor({ tickets, onChange }: TicketOffersEditorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'standard' as 'standard' | 'vip',
    price: '',
    currency: 'USD',
  });

  const handleAdd = () => {
    if (!formData.name || !formData.price) return;

    const newTicket: Ticket = {
      id: BigInt(Date.now()),
      name: formData.name,
      type: (formData.type === 'standard' 
        ? ({ standard: null } as unknown)
        : ({ vip: null } as unknown)) as TicketType,
      price: parseFloat(formData.price),
      currency: formData.currency,
      available: true,
    };

    if (editingIndex !== null) {
      const updated = [...tickets];
      updated[editingIndex] = newTicket;
      onChange(updated);
      setEditingIndex(null);
    } else {
      onChange([...tickets, newTicket]);
    }

    setFormData({ name: '', type: 'standard', price: '', currency: 'USD' });
  };

  const handleEdit = (index: number) => {
    const ticket = tickets[index];
    setFormData({
      name: ticket.name,
      type: getTicketTypeValue(ticket.type),
      price: ticket.price.toString(),
      currency: ticket.currency,
    });
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    onChange(tickets.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TicketIcon className="h-5 w-5" />
          Ticket Options *
        </CardTitle>
        <CardDescription>Add ticket prices from different sources</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {tickets.length > 0 && (
          <div className="space-y-2">
            {tickets.map((ticket, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border bg-card"
              >
                <div>
                  <p className="font-medium">{ticket.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {getTicketTypeLabel(ticket.type)} • {ticket.currency} {ticket.price.toFixed(2)}
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
              <Label htmlFor="ticketName">Source / Name</Label>
              <Input
                id="ticketName"
                placeholder="e.g., Ticketmaster"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ticketType">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: 'standard' | 'vip') =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger id="ticketType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ticketPrice">Price</Label>
              <Input
                id="ticketPrice"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ticketCurrency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger id="ticketCurrency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleAdd} variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            {editingIndex !== null ? 'Update Ticket' : 'Add Ticket'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
