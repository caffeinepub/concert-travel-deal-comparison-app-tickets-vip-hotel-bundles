import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetGroups, useCreateGroup } from '@/hooks/useQueries';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Users, MessageCircle, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import UnauthSignInScreen from '@/components/auth/UnauthSignInScreen';

export default function GroupsPage() {
  const { identity } = useInternetIdentity();
  const { data: groups, isLoading } = useGetGroups();
  const createGroupMutation = useCreateGroup();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    if (!identity) {
      toast.error('You must be signed in to create a group');
      return;
    }

    try {
      const group = await createGroupMutation.mutateAsync({
        groupName: newGroupName,
        members: [],
      });
      toast.success('Group created successfully');
      setDialogOpen(false);
      setNewGroupName('');
      navigate({ to: `/groups/${group.id.toString()}` });
    } catch (error) {
      toast.error('Failed to create group');
      console.error('Create group error:', error);
    }
  };

  if (!identity) {
    return (
      <UnauthSignInScreen
        title="NovaTrips"
        description="Connect with fellow concert travelers and plan together"
        signInMessage="Sign in to create groups and chat with other travelers"
      />
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">NovaTrips</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">NovaTrips</h1>
          <p className="text-muted-foreground text-lg">
            Your concert travel groups and conversations
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              New Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
              <DialogDescription>
                Start a group to chat with friends about your concert trip
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Remember: Never share personal information like addresses, phone numbers, or financial details in group chats.
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label htmlFor="groupName">Group Name</Label>
                <Input
                  id="groupName"
                  placeholder="e.g., LA Concert Trip 2026"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateGroup();
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
                  setNewGroupName('');
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateGroup} disabled={createGroupMutation.isPending}>
                {createGroupMutation.isPending ? 'Creating...' : 'Create Group'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {!groups || groups.length === 0 ? (
        <Card className="border-2">
          <CardContent className="pt-12 pb-12 text-center">
            <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg mb-6">No groups yet. Create your first group to start chatting!</p>
            <Button size="lg" onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-5 w-5" />
              Create Group
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Card
              key={group.id.toString()}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate({ to: `/groups/${group.id.toString()}` })}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {group.groupName}
                </CardTitle>
                <CardDescription>
                  {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {group.messages.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MessageCircle className="h-4 w-4 text-muted-foreground mt-1" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground truncate">
                          {group.messages[0].author?.userName || 'Unknown'}
                        </p>
                        <p className="text-sm truncate">{group.messages[0].content}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {group.messages.length} {group.messages.length === 1 ? 'message' : 'messages'}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No messages yet</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
