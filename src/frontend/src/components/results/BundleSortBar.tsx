import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { SortOption } from '@/pages/ResultsPage';

interface BundleSortBarProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export default function BundleSortBar({ sortBy, onSortChange }: BundleSortBarProps) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border bg-card">
      <Label htmlFor="sort" className="text-sm font-medium whitespace-nowrap">
        Sort by:
      </Label>
      <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
        <SelectTrigger id="sort" className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="price-asc">Lowest Price</SelectItem>
          <SelectItem value="hotel-rating">Hotel Rating</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
