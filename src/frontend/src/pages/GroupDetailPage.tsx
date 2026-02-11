import { useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useGetGroup, useAddGroupMessage, useLeaveGroup, useGetCallerUserProfile } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, LogOut, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import ChatPanel from '@/components/groups/ChatPanel';
import type { NewMessage, GroupMember } from '@/backend';

export default function GroupDetailPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: profile } = useGetCallerUserProfile();
  const { groupId } = useParams({ strict: false }) as { groupId: string };
  const { data: group, isLoading } = useGetGroup(BigInt(groupId));
  const postMutation = useAddGroupMessage();
  const leaveMutation = useLeaveGroup();

  const handlePostMessage = async (content: string) => {
    if (!identity || !profile) {
      toast.error('Profile not loaded');
      return;
    }

    const displayName = profile.publicScreenName || 'User';

    const author: GroupMember = {
      id: BigInt(Date.now()),
      principal: identity.getPrincipal(),
      userName: displayName,
      isConfirmed: true,
    };

    const message: NewMessage = {
      content,
      author,
    };

    try {
      await postMutation.mutateAsync({
        groupId: BigInt(groupId),
        message,
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await leaveMutation.mutateAsync(BigInt(groupId));
      toast.success('Left group');
      navigate({ to: '/groups' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to leave group');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Group not found</p>
          <Button onClick={() => navigate({ to: '/groups' })}>
            Back to Groups
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/groups' })}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{group.groupName}</h1>
            <p className="text-sm text-muted-foreground">
              {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
            </p>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Leave Group
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Leave Group?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to leave this group? You won't be able to see messages or rejoin without an invitation.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLeaveGroup}>
                Leave Group
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Alert className="mb-6">
        <AlertDescription>
          <strong>Safety Reminder:</strong> Never share personal information like your address, phone number, or financial details in group chats. 
          Meet in public places and let someone know your plans.
        </AlertDescription>
      </Alert>

      <ChatPanel
        messages={group.messages}
        onSendMessage={handlePostMessage}
        isSending={postMutation.isPending}
      />
    </div>
  );
}
