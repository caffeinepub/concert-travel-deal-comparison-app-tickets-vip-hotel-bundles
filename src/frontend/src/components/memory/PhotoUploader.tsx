import { useState } from 'react';
import { useUploadPhoto } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '@/backend';
import type { PhotoInput } from '@/backend';

interface PhotoUploaderProps {
  albumId: bigint;
}

export default function PhotoUploader({ albumId }: PhotoUploaderProps) {
  const uploadMutation = useUploadPhoto();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      const externalBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      const photo: PhotoInput = {
        imageUrl: file.name,
        description: '',
        tags: [],
        externalBlob,
      };

      await uploadMutation.mutateAsync({ albumId, photo });
      toast.success('Photo uploaded!');
      e.target.value = '';
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="photo-upload" className="text-base font-semibold">
          Upload Photos
        </Label>
        <p className="text-sm text-muted-foreground mb-4">
          Add photos to your album. You can tag people after uploading.
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <Input
          id="photo-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
        <Button
          onClick={() => document.getElementById('photo-upload')?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Choose Photo
            </>
          )}
        </Button>
      </div>

      {uploading && uploadProgress > 0 && (
        <div className="space-y-2">
          <Progress value={uploadProgress} />
          <p className="text-sm text-muted-foreground text-center">
            {uploadProgress}% uploaded
          </p>
        </div>
      )}
    </div>
  );
}
