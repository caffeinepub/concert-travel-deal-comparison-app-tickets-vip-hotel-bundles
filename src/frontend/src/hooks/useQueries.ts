import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { 
  UserProfile, 
  TripComparison, 
  ComparisonInput, 
  Album, 
  PhotoInput,
  Group,
  GroupMember,
  NewMessage,
  FriendEntry
} from '@/backend';
import type { TripBuilderState } from '@/pages/TripBuilderPage';
import type { Bundle } from '@/lib/localComparisonEngine';
import { calculateTravelWindow } from '@/lib/tripWindow';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useSetParentPermission() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (hasPermission: boolean) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setParentPermissionStatus(hasPermission);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useAddFriend() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (friendEntry: FriendEntry) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addFriendRequest(friendEntry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useRemoveFriend() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (friendId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeFriend(friendId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetUserComparisons() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<TripComparison[]>({
    queryKey: ['userComparisons', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getAllUserComparisons(identity.getPrincipal());
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useSaveTripComparison() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({ tripData, bundles }: { tripData: TripBuilderState; bundles: Bundle[] }) => {
      if (!actor) throw new Error('Actor not available');
      if (!identity) throw new Error('Must be signed in to save');

      const travelWindow = calculateTravelWindow(
        tripData.concertDate,
        tripData.daysBefore,
        tripData.daysAfter
      );

      const input: ComparisonInput = {
        event: `${tripData.eventName} - ${tripData.eventCity}`,
        travelWindow,
        ticketSources: tripData.tickets,
        vipPackageOptions: tripData.vipPackages,
        hotels: tripData.hotels,
      };

      const foundVIPPackage = tripData.vipPackages.length > 0;

      return actor.createTripComparison(input, foundVIPPackage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userComparisons'] });
    },
  });
}

export function useDeleteComparison() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteComparison(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userComparisons'] });
    },
  });
}

// Memory Finder hooks
export function useGetAlbums() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Album[]>({
    queryKey: ['albums', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getAllAlbums(identity.getPrincipal());
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useGetAlbum(albumId: string) {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Album | null>({
    queryKey: ['album', albumId],
    queryFn: async () => {
      if (!actor || !identity) return null;
      return actor.getAlbum(BigInt(albumId));
    },
    enabled: !!actor && !actorFetching && !!identity && !!albumId,
  });
}

export function useCreateAlbum() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (title: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createAlbum(title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
    },
  });
}

export function useUploadPhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ albumId, photo }: { albumId: bigint; photo: PhotoInput }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadPhotoToAlbum(albumId, photo);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['album', variables.albumId.toString()] });
    },
  });
}

export function useDeletePhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ albumId, photoId }: { albumId: bigint; photoId: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deletePhotoFromAlbum(albumId, photoId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['album', variables.albumId.toString()] });
    },
  });
}

export function useDeleteAlbum() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (albumId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteAlbum(albumId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
    },
  });
}

// Groups hooks
export function useGetGroups() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Group[]>({
    queryKey: ['groups'],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getAllGroups();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useGetGroup(groupId: string) {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Group | null>({
    queryKey: ['group', groupId],
    queryFn: async () => {
      if (!actor || !identity) return null;
      return actor.getGroup(BigInt(groupId));
    },
    enabled: !!actor && !actorFetching && !!identity && !!groupId,
    refetchInterval: 5000, // Poll every 5 seconds for new messages
  });
}

export function useCreateGroup() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({ groupName, members }: { groupName: string; members: GroupMember[] }) => {
      if (!actor || !identity) throw new Error('Actor not available');
      return actor.createGroup(groupName, identity.getPrincipal(), members, null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

export function usePostMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ groupId, message }: { groupId: bigint; message: NewMessage }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addGroupMessage(groupId, message);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['group', variables.groupId.toString()] });
    },
  });
}

export function useLeaveGroup() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (groupId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.leaveGroup(groupId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}
