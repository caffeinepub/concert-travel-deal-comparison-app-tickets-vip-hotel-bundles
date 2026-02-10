import { useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useGetGroup, usePostMessage, useLeaveGroup, useGetCallerUserProfile } from '@/hooks/useQueries';
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
  const { data: group, isLoading } = useGetGroup(groupId);
  const postMutation = usePostMessage();
  const leaveMutation = useLeaveGroup();

  const handlePostMessage = async (content: string) => {
    if (!identity || !profile) {
      toast.error('Profile not loaded');
      return;
    }

    const author: GroupMember = {
      id: BigInt(Date.now()),
      principal: identity.getPrincipal(),
      userName: profile.name,
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
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Group Not Found</h1>
        <Button onClick={() => navigate({ to: '/groups' })}>
          Back to Groups
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/groups' })}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Groups
        </Button>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{group.groupName}</h1>
            <p className="text-muted-foreground">
              {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
            </p>
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
                  Are you sure you want to leave "{group.groupName}"? You won't be able to see messages or rejoin without an invitation.
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
      </div>

      <Alert className="mb-6 border-amber-500/20 bg-amber-500/5">
        <AlertDescription className="text-sm">
          <strong>Stay Safe:</strong> Don't share personal information like addresses, phone numbers, or payment details. Keep conversations friendly and respectful.
        </AlertDescription>
      </Alert>

      <Card>
        <ChatPanel
          messages={group.messages}
          onSendMessage={handlePostMessage}
          isSending={postMutation.isPending}
        />
      </Card>
    </div>
  );
}
