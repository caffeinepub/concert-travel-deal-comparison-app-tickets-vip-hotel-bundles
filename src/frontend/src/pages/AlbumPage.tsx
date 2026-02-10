import { useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useGetAlbum, useDeleteAlbum } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import PhotoUploader from '@/components/memory/PhotoUploader';
import PhotoGrid from '@/components/memory/PhotoGrid';

export default function AlbumPage() {
  const navigate = useNavigate();
  const { albumId } = useParams({ strict: false }) as { albumId: string };
  const { data: album, isLoading } = useGetAlbum(BigInt(albumId));
  const deleteMutation = useDeleteAlbum();

  const handleDeleteAlbum = async () => {
    try {
      await deleteMutation.mutateAsync(BigInt(albumId));
      toast.success('Album deleted');
      navigate({ to: '/memory-finder' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete album');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!album) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Album Not Found</h1>
        <Button onClick={() => navigate({ to: '/memory-finder' })}>
          Back to Memory Finder
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/memory-finder' })}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Albums
        </Button>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{album.title}</h1>
            <p className="text-muted-foreground">
              {album.photos.length} {album.photos.length === 1 ? 'photo' : 'photos'}
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Album
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Album?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete "{album.title}" and all its photos. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAlbum}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <PhotoUploader albumId={BigInt(albumId)} />
        </CardContent>
      </Card>

      <PhotoGrid albumId={BigInt(albumId)} photos={album.photos} />
    </div>
  );
}
