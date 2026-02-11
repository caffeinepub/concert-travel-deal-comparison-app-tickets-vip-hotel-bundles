import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useGetLegalInfo, useSaveLegalInfo } from '@/hooks/useQueries';
import { Lock, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function LegalNameSection() {
  const { data: legalInfo, isLoading } = useGetLegalInfo();
  const saveMutation = useSaveLegalInfo();
  const [legalName, setLegalName] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (legalInfo) {
      setLegalName(legalInfo.legalName || '');
    }
  }, [legalInfo]);

  const handleSave = async () => {
    try {
      await saveMutation.mutateAsync({ legalName: legalName.trim() });
      toast.success('Legal name saved successfully');
      setHasChanges(false);
    } catch (error) {
      toast.error('Failed to save legal name');
      console.error('Save error:', error);
    }
  };

  const handleChange = (value: string) => {
    setLegalName(value);
    setHasChanges(value.trim() !== (legalInfo?.legalName || ''));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Legal Name (Private)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-20 animate-pulse bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Legal Name (Private)
        </CardTitle>
        <CardDescription>
          Your legal name is kept private and used only for checkout autofill when booking tickets and travel. 
          We do not store payment card details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="legalName">Legal Name (as it appears on your ID)</Label>
            <Input
              id="legalName"
              placeholder="Enter your legal name"
              value={legalName}
              onChange={(e) => handleChange(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              This information is saved to your account for convenience and is never shared publicly.
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || !legalName.trim() || saveMutation.isPending}
            className="w-full sm:w-auto"
          >
            {saveMutation.isPending ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Legal Name
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
