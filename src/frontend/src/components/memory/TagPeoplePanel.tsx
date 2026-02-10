import { useState } from 'react';
import { useGetCallerUserProfile, useUploadPhoto } from '@/hooks/useQueries';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Principal } from '@icp-sdk/core/principal';
import type { Photo, PhotoTag, PhotoInput } from '@/backend';

interface TagPeoplePanelProps {
  photo: Photo;
  albumId: bigint;
  onClose: () => void;
}

export default function TagPeoplePanel({ photo, albumId, onClose }: TagPeoplePanelProps) {
  const { data: profile } = useGetCallerUserProfile();
  const uploadMutation = useUploadPhoto();
  const [tags, setTags] = useState<PhotoTag[]>(photo.tags);
  const [newTagMode, setNewTagMode] = useState<'friend' | 'principal' | null>(null);
  const [selectedFriendId, setSelectedFriendId] = useState<string>('');
  const [principalInput, setPrincipalInput] = useState('');

  const handleAddFriendTag = () => {
    if (!selectedFriendId || !profile) return;

    const friend = profile.friends.find(f => f.id.toString() === selectedFriendId);
    if (!friend) return;

    const newTag: PhotoTag = {
      principal: friend.principal,
      displayName: friend.name || friend.principal.toString().slice(0, 8),
      position: [0.5, 0.5],
    };

    setTags([...tags, newTag]);
    setSelectedFriendId('');
    setNewTagMode(null);
  };

  const handleAddPrincipalTag = () => {
    if (!principalInput.trim()) return;

    try {
      const principal = Principal.fromText(principalInput.trim());
      const newTag: PhotoTag = {
        principal,
        displayName: principalInput.trim().slice(0, 8),
        position: [0.5, 0.5],
      };

      setTags([...tags, newTag]);
      setPrincipalInput('');
      setNewTagMode(null);
    } catch (error) {
      toast.error('Invalid principal ID');
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      const updatedPhoto: PhotoInput = {
        imageUrl: photo.imageUrl,
        description: photo.description,
        tags,
        externalBlob: photo.externalBlob,
      };

      await uploadMutation.mutateAsync({ albumId, photo: updatedPhoto });
      toast.success('Tags updated!');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update tags');
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tag People</DialogTitle>
          <DialogDescription>
            Add tags to identify people in this photo. Tagging is manual - this app does not automatically identify faces.
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <AlertDescription className="text-sm">
            <strong>Privacy Note:</strong> This app does not use facial recognition. You manually add tags by selecting friends or entering user IDs.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <Label className="text-base font-semibold mb-2 block">Current Tags</Label>
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="gap-2">
                    {tag.displayName}
                    <button
                      onClick={() => handleRemoveTag(index)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No tags yet</p>
            )}
          </div>

          {!newTagMode && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setNewTagMode('friend')}
                disabled={!profile?.friends || profile.friends.length === 0}
              >
                <Plus className="mr-2 h-4 w-4" />
                Tag Friend
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setNewTagMode('principal')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Tag by ID
              </Button>
            </div>
          )}

          {newTagMode === 'friend' && profile?.friends && (
            <div className="space-y-2 p-4 border rounded-lg">
              <Label>Select Friend</Label>
              <Select value={selectedFriendId} onValueChange={setSelectedFriendId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a friend" />
                </SelectTrigger>
                <SelectContent>
                  {profile.friends.map((friend) => (
                    <SelectItem key={friend.id.toString()} value={friend.id.toString()}>
                      {friend.name || friend.principal.toString().slice(0, 8)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddFriendTag} disabled={!selectedFriendId}>
                  Add Tag
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setNewTagMode(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {newTagMode === 'principal' && (
            <div className="space-y-2 p-4 border rounded-lg">
              <Label>Enter Principal ID</Label>
              <Input
                placeholder="Enter user principal ID"
                value={principalInput}
                onChange={(e) => setPrincipalInput(e.target.value)}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddPrincipalTag} disabled={!principalInput.trim()}>
                  Add Tag
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setNewTagMode(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={uploadMutation.isPending}>
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Tags'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
