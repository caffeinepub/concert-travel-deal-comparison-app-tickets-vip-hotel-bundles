import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface GeoLocation {
    latitude: number;
    longitude: number;
}
export interface LegalInfo {
    legalName: string;
}
export type Time = bigint;
export interface Amenity {
    name: string;
    description?: string;
    category: AmenityCategory;
}
export interface Group {
    id: bigint;
    creator: Principal;
    members: Array<GroupMember>;
    comparisonId?: bigint;
    messages: Array<Message>;
    createdAt: Time;
    lastUpdate: Time;
    groupName: string;
}
export interface Album {
    id: bigint;
    title: string;
    creator: Principal;
    isShared: boolean;
    photos: Array<Photo>;
}
export interface NewMessage {
    content: string;
    author?: GroupMember;
}
export interface PriceRange {
    maxPrice: number;
    currency: string;
    minPrice: number;
    rateType: PriceType;
}
export interface Hotel {
    roomTypes: Array<RoomType>;
    starRating?: number;
    country: string;
    reviews?: number;
    imageUrls?: Array<string>;
    city: string;
    name: string;
    checkInTime?: string;
    amenities: Array<Amenity>;
    state?: string;
    address: string;
    prices?: PriceRange;
    brand?: string;
    checkOutTime?: string;
    location?: GeoLocation;
}
export interface VIPPackage {
    id: bigint;
    exclusivePerks?: string;
    name: string;
    inclusions: Array<string>;
    currency: string;
    price: number;
}
export interface Photo {
    id: bigint;
    externalBlob: ExternalBlob;
    createdAt: Time;
    createdBy: Principal;
    tags: Array<PhotoTag>;
    description: string;
    imageUrl: string;
}
export interface ComparisonInput {
    ticketSources: Array<Ticket>;
    event: string;
    userChoice?: BundleInput;
    vipPackageOptions: Array<VIPPackage>;
    hotels: Array<Hotel>;
    travelWindow: TravelWindow;
}
export interface BundleInput {
    ticket: Ticket;
    hotel: Hotel;
    roomType: RoomType;
}
export interface GroupMember {
    id: bigint;
    userName: string;
    principal: Principal;
    isConfirmed: boolean;
}
export interface Bundle {
    ticket: Ticket;
    hotel: Hotel;
    roomType: RoomType;
}
export interface TripComparison {
    id: bigint;
    userId: Principal;
    createdAt: Time;
    upgradeAlternatives: Array<Bundle>;
    ticketSources: Array<Ticket>;
    event: string;
    userChoice?: Bundle;
    vipPackageOptions: Array<VIPPackage>;
    hotels: Array<Hotel>;
    travelWindow: TravelWindow;
    foundVIPPackage: boolean;
}
export interface RoomType {
    bedType?: string;
    occupancy?: bigint;
    views?: string;
    cancellationPolicy?: string;
    name: string;
    size?: bigint;
    description?: string;
    amenities: Array<Amenity>;
    price: number;
}
export interface PhotoTag {
    principal: Principal;
    displayName: string;
    position: [number, number];
}
export interface TravelWindow {
    checkIn: Time;
    checkOut: Time;
}
export interface FriendEntry {
    id: bigint;
    principal: Principal;
    name?: string;
    isConfirmed: boolean;
}
export interface PhotoInput {
    externalBlob: ExternalBlob;
    tags: Array<PhotoTag>;
    description: string;
    imageUrl: string;
}
export interface Message {
    id: bigint;
    content: string;
    author?: GroupMember;
    timestamp: Time;
}
export interface Ticket {
    id: bigint;
    name: string;
    type: TicketType;
    available: boolean;
    currency: string;
    price: number;
}
export interface UserProfile {
    publicScreenName: string;
    parentPermissionConfirmed: boolean;
    friends: Array<FriendEntry>;
}
export enum AmenityCategory {
    transportation = "transportation",
    safetyAndSecurity = "safetyAndSecurity",
    entertainment = "entertainment",
    roomFeatures = "roomFeatures",
    recreationalFacilities = "recreationalFacilities",
    businessServices = "businessServices",
    petFriendly = "petFriendly",
    accessibilityFeatures = "accessibilityFeatures",
    technology = "technology",
    diningOptions = "diningOptions",
    hotelServices = "hotelServices",
    hospitalityServices = "hospitalityServices",
    wellnessAndSpa = "wellnessAndSpa"
}
export enum PriceType {
    perNight = "perNight",
    perWeek = "perWeek",
    perMonth = "perMonth"
}
export enum TicketType {
    vip = "vip",
    standard = "standard"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addFriendRequest(friendEntry: FriendEntry): Promise<void>;
    addGroupMessage(groupId: bigint, message: NewMessage): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createAlbum(title: string): Promise<Album>;
    createGroup(groupName: string, creator: Principal, members: Array<GroupMember>, comparisonId: bigint | null): Promise<Group>;
    createTripComparison(input: ComparisonInput, foundVIPPackage: boolean): Promise<TripComparison>;
    deleteAlbum(albumId: bigint): Promise<void>;
    deleteComparison(id: bigint): Promise<void>;
    deletePhotoFromAlbum(albumId: bigint, photoId: bigint): Promise<void>;
    getAlbum(albumId: bigint): Promise<Album | null>;
    getAllAlbums(userId: Principal): Promise<Array<Album>>;
    getAllGroups(): Promise<Array<Group>>;
    getAllUserComparisons(userId: Principal): Promise<Array<TripComparison>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getGroup(groupId: bigint): Promise<Group | null>;
    getLegalInfo(): Promise<LegalInfo | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    leaveGroup(groupId: bigint): Promise<void>;
    removeFriend(friendId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveLegalInfo(legalInfo: LegalInfo): Promise<void>;
    setParentPermissionStatus(hasPermission: boolean): Promise<void>;
    uploadPhotoToAlbum(albumId: bigint, photo: PhotoInput): Promise<void>;
}
