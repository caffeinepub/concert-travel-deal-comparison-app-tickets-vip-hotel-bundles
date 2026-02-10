import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetAlbums, useCreateAlbum } from '@/hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import UnauthSignInScreen from '@/components/auth/UnauthSignInScreen';

export default function MemoryFinderPage() {
  const { identity } = useInternetIdentity();
  const { data: albums, isLoading } = useGetAlbums();
  const createAlbumMutation = useCreateAlbum();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState('');

  const handleCreateAlbum = async () => {
    if (!newAlbumTitle.trim()) {
      toast.error('Please enter an album title');
      return;
    }

    try {
      const album = await createAlbumMutation.mutateAsync(newAlbumTitle);
      toast.success('Album created successfully');
      setDialogOpen(false);
      setNewAlbumTitle('');
      navigate({ to: `/albums/${album.id.toString()}` });
    } catch (error) {
      toast.error('Failed to create album');
      console.error('Create album error:', error);
    }
  };

  if (!identity) {
    return (
      <UnauthSignInScreen
        title="EchoPass"
        description="Organize and share your concert memories with friends"
        signInMessage="Sign in to create photo albums and tag friends"
      />
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">EchoPass</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">EchoPass</h1>
          <p className="text-muted-foreground text-lg">
            Your concert photo albums and shared memories
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              New Album
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Album</DialogTitle>
              <DialogDescription>
                Create an album to organize your concert photos
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="albumTitle">Album Title</Label>
                <Input
                  id="albumTitle"
                  placeholder="e.g., Summer Festival 2026"
                  value={newAlbumTitle}
                  onChange={(e) => setNewAlbumTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateAlbum();
                    }
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                  setNewAlbumTitle('');
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateAlbum} disabled={createAlbumMutation.isPending}>
                {createAlbumMutation.isPending ? 'Creating...' : 'Create Album'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {!albums || albums.length === 0 ? (
        <Card className="border-2">
          <CardContent className="pt-12 pb-12 text-center">
            <ImageIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg mb-6">No albums yet. Create your first album to start organizing photos!</p>
            <Button size="lg" onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-5 w-5" />
              Create Album
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <Card
              key={album.id.toString()}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate({ to: `/albums/${album.id.toString()}` })}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  {album.title}
                </CardTitle>
                <CardDescription>
                  {album.photos.length} {album.photos.length === 1 ? 'photo' : 'photos'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {album.photos.length > 0 ? (
                  <div className="aspect-video bg-muted rounded-md overflow-hidden">
                    <img
                      src={album.photos[0].externalBlob.getDirectURL()}
                      alt={album.photos[0].description}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
