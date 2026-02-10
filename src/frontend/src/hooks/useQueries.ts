import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { 
  UserProfile, 
  FriendEntry, 
  TripComparison, 
  Album, 
  PhotoInput,
  Group,
  GroupMember,
  NewMessage,
  ComparisonInput,
  BundleInput,
} from '@/backend';
import type { TripBuilderState } from '@/pages/TripBuilderPage';
import type { Bundle } from '@/lib/localComparisonEngine';
import type { UpgradeAlternatives } from '@/lib/upgradeDetection';
import { calculateTravelWindow } from '@/lib/tripWindow';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveUserProfile() {
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

// Friend Management
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

// Trip Comparison Queries
export function useGetUserComparisons() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<TripComparison[]>({
    queryKey: ['userComparisons', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getAllUserComparisons(identity.getPrincipal());
    },
    enabled: !!actor && !!identity && !actorFetching,
  });
}

export function useSaveTripComparison() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({ 
      tripData, 
      bundles,
      selectedBundle,
      upgrades,
    }: { 
      tripData: TripBuilderState; 
      bundles: Bundle[];
      selectedBundle: Bundle;
      upgrades: UpgradeAlternatives;
    }) => {
      if (!actor) throw new Error('Actor not available');
      if (!identity) throw new Error('Not authenticated');

      const travelWindow = calculateTravelWindow(
        tripData.concertDate,
        tripData.daysBefore,
        tripData.daysAfter
      );

      // Convert Bundle to BundleInput for backend
      const userChoice: BundleInput = {
        ticket: selectedBundle.ticket,
        hotel: selectedBundle.hotel,
        roomType: selectedBundle.roomType,
      };

      const input: ComparisonInput = {
        event: `${tripData.eventName} - ${tripData.eventCity}`,
        travelWindow,
        ticketSources: tripData.tickets,
        vipPackageOptions: tripData.vipPackages,
        hotels: tripData.hotels,
        userChoice,
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

// Album Queries
export function useGetUserAlbums() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Album[]>({
    queryKey: ['userAlbums', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getAllAlbums(identity.getPrincipal());
    },
    enabled: !!actor && !!identity && !actorFetching,
  });
}

export function useGetAlbum(albumId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Album | null>({
    queryKey: ['album', albumId?.toString()],
    queryFn: async () => {
      if (!actor || !albumId) return null;
      return actor.getAlbum(albumId);
    },
    enabled: !!actor && !!albumId && !actorFetching,
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
      queryClient.invalidateQueries({ queryKey: ['userAlbums'] });
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
      queryClient.invalidateQueries({ queryKey: ['userAlbums'] });
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
      queryClient.invalidateQueries({ queryKey: ['userAlbums'] });
    },
  });
}

// Group Queries
export function useGetAllGroups() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Group[]>({
    queryKey: ['groups'],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getAllGroups();
    },
    enabled: !!actor && !!identity && !actorFetching,
    refetchInterval: 5000,
  });
}

export function useGetGroup(groupId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Group | null>({
    queryKey: ['group', groupId?.toString()],
    queryFn: async () => {
      if (!actor || !groupId) return null;
      return actor.getGroup(groupId);
    },
    enabled: !!actor && !!groupId && !actorFetching,
    refetchInterval: 5000,
  });
}

export function useCreateGroup() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      groupName,
      creator,
      members,
      comparisonId,
    }: {
      groupName: string;
      creator: string;
      members: GroupMember[];
      comparisonId: bigint | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createGroup(groupName, creator as any, members, comparisonId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

export function useAddGroupMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ groupId, message }: { groupId: bigint; message: NewMessage }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addGroupMessage(groupId, message);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['group', variables.groupId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
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
