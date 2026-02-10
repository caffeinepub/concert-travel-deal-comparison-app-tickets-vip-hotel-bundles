import { useState } from 'react';
import { useDeletePhoto } from '@/hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Tag } from 'lucide-react';
import { toast } from 'sonner';
import TagPeoplePanel from './TagPeoplePanel';
import type { Photo } from '@/backend';

interface PhotoGridProps {
  albumId: bigint;
  photos: Photo[];
}

export default function PhotoGrid({ albumId, photos }: PhotoGridProps) {
  const deleteMutation = useDeletePhoto();
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const handleDeletePhoto = async (photoId: bigint) => {
    try {
      await deleteMutation.mutateAsync({ albumId, photoId });
      toast.success('Photo deleted');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete photo');
    }
  };

  if (photos.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <p className="text-muted-foreground">No photos yet. Upload your first photo to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <Card key={photo.id.toString()} className="overflow-hidden">
            <div className="aspect-square bg-muted relative group">
              <img
                src={photo.externalBlob.getDirectURL()}
                alt={photo.description || 'Photo'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <Tag className="mr-2 h-4 w-4" />
                  Tag People
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Photo?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete this photo. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            {photo.tags.length > 0 && (
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">
                  Tagged: {photo.tags.map(t => t.displayName).join(', ')}
                </p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {selectedPhoto && (
        <TagPeoplePanel
          photo={selectedPhoto}
          albumId={albumId}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </>
  );
}
