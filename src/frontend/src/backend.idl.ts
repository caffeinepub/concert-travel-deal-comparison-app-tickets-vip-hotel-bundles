export const idlFactory = ({ IDL }: any) => {
  const Time = IDL.Int;
  const FriendEntry = IDL.Record({
    id: IDL.Nat,
    principal: IDL.Principal,
    name: IDL.Opt(IDL.Text),
    isConfirmed: IDL.Bool,
  });
  const UserProfile = IDL.Record({
    name: IDL.Text,
    parentPermissionConfirmed: IDL.Bool,
    friends: IDL.Vec(FriendEntry),
  });
  const GroupMember = IDL.Record({
    id: IDL.Nat,
    userName: IDL.Text,
    principal: IDL.Principal,
    isConfirmed: IDL.Bool,
  });
  const NewMessage = IDL.Record({
    content: IDL.Text,
    author: IDL.Opt(GroupMember),
  });
  const UserRole = IDL.Variant({
    admin: IDL.Null,
    user: IDL.Null,
    guest: IDL.Null,
  });
  const Album = IDL.Record({
    id: IDL.Nat,
    title: IDL.Text,
    creator: IDL.Principal,
    isShared: IDL.Bool,
    photos: IDL.Vec(
      IDL.Record({
        id: IDL.Nat,
        externalBlob: IDL.Text,
        createdAt: Time,
        createdBy: IDL.Principal,
        tags: IDL.Vec(
          IDL.Record({
            principal: IDL.Principal,
            displayName: IDL.Text,
            position: IDL.Tuple(IDL.Float64, IDL.Float64),
          })
        ),
        description: IDL.Text,
        imageUrl: IDL.Text,
      })
    ),
  });
  const Message = IDL.Record({
    id: IDL.Nat,
    content: IDL.Text,
    author: IDL.Opt(GroupMember),
    timestamp: Time,
  });
  const Group = IDL.Record({
    id: IDL.Nat,
    creator: IDL.Principal,
    members: IDL.Vec(GroupMember),
    comparisonId: IDL.Opt(IDL.Nat),
    messages: IDL.Vec(Message),
    createdAt: Time,
    lastUpdate: Time,
    groupName: IDL.Text,
  });
  const AmenityCategory = IDL.Variant({
    transportation: IDL.Null,
    safetyAndSecurity: IDL.Null,
    entertainment: IDL.Null,
    roomFeatures: IDL.Null,
    recreationalFacilities: IDL.Null,
    businessServices: IDL.Null,
    petFriendly: IDL.Null,
    accessibilityFeatures: IDL.Null,
    technology: IDL.Null,
    diningOptions: IDL.Null,
    hotelServices: IDL.Null,
    hospitalityServices: IDL.Null,
    wellnessAndSpa: IDL.Null,
  });
  const Amenity = IDL.Record({
    name: IDL.Text,
    description: IDL.Opt(IDL.Text),
    category: AmenityCategory,
  });
  const PriceType = IDL.Variant({
    perNight: IDL.Null,
    perWeek: IDL.Null,
    perMonth: IDL.Null,
  });
  const PriceRange = IDL.Record({
    maxPrice: IDL.Float64,
    currency: IDL.Text,
    minPrice: IDL.Float64,
    rateType: PriceType,
  });
  const GeoLocation = IDL.Record({
    latitude: IDL.Float64,
    longitude: IDL.Float64,
  });
  const RoomType = IDL.Record({
    bedType: IDL.Opt(IDL.Text),
    occupancy: IDL.Opt(IDL.Nat),
    views: IDL.Opt(IDL.Text),
    cancellationPolicy: IDL.Opt(IDL.Text),
    name: IDL.Text,
    size: IDL.Opt(IDL.Nat),
    description: IDL.Opt(IDL.Text),
    amenities: IDL.Vec(Amenity),
    price: IDL.Float64,
  });
  const Hotel = IDL.Record({
    roomTypes: IDL.Vec(RoomType),
    starRating: IDL.Opt(IDL.Float64),
    country: IDL.Text,
    reviews: IDL.Opt(IDL.Float64),
    imageUrls: IDL.Opt(IDL.Vec(IDL.Text)),
    city: IDL.Text,
    name: IDL.Text,
    checkInTime: IDL.Opt(IDL.Text),
    amenities: IDL.Vec(Amenity),
    state: IDL.Opt(IDL.Text),
    address: IDL.Text,
    prices: IDL.Opt(PriceRange),
    brand: IDL.Opt(IDL.Text),
    checkOutTime: IDL.Opt(IDL.Text),
    location: IDL.Opt(GeoLocation),
  });
  const TicketType = IDL.Variant({
    vip: IDL.Null,
    standard: IDL.Null,
  });
  const Ticket = IDL.Record({
    id: IDL.Nat,
    name: IDL.Text,
    type: TicketType,
    available: IDL.Bool,
    currency: IDL.Text,
    price: IDL.Float64,
  });
  const VIPPackage = IDL.Record({
    id: IDL.Nat,
    exclusivePerks: IDL.Opt(IDL.Text),
    name: IDL.Text,
    inclusions: IDL.Vec(IDL.Text),
    currency: IDL.Text,
    price: IDL.Float64,
  });
  const TravelWindow = IDL.Record({
    checkIn: Time,
    checkOut: Time,
  });
  const ComparisonInput = IDL.Record({
    ticketSources: IDL.Vec(Ticket),
    event: IDL.Text,
    vipPackageOptions: IDL.Vec(VIPPackage),
    hotels: IDL.Vec(Hotel),
    travelWindow: TravelWindow,
  });
  const Bundle = IDL.Record({
    ticket: Ticket,
    hotel: Hotel,
    roomType: RoomType,
  });
  const TripComparison = IDL.Record({
    id: IDL.Nat,
    userId: IDL.Principal,
    createdAt: Time,
    bundles: IDL.Vec(Bundle),
    ticketSources: IDL.Vec(Ticket),
    event: IDL.Text,
    vipPackageOptions: IDL.Vec(VIPPackage),
    hotels: IDL.Vec(Hotel),
    travelWindow: TravelWindow,
    foundVIPPackage: IDL.Bool,
  });
  const PhotoInput = IDL.Record({
    externalBlob: IDL.Text,
    tags: IDL.Vec(
      IDL.Record({
        principal: IDL.Principal,
        displayName: IDL.Text,
        position: IDL.Tuple(IDL.Float64, IDL.Float64),
      })
    ),
    description: IDL.Text,
    imageUrl: IDL.Text,
  });

  return IDL.Service({
    addFriendRequest: IDL.Func([FriendEntry], [], []),
    addGroupMessage: IDL.Func([IDL.Nat, NewMessage], [], []),
    assignCallerUserRole: IDL.Func([IDL.Principal, UserRole], [], []),
    createAlbum: IDL.Func([IDL.Text], [Album], []),
    createGroup: IDL.Func(
      [IDL.Text, IDL.Principal, IDL.Vec(GroupMember), IDL.Opt(IDL.Nat)],
      [Group],
      []
    ),
    createTripComparison: IDL.Func([ComparisonInput, IDL.Bool], [TripComparison], []),
    deleteAlbum: IDL.Func([IDL.Nat], [], []),
    deleteComparison: IDL.Func([IDL.Nat], [], []),
    deletePhotoFromAlbum: IDL.Func([IDL.Nat, IDL.Nat], [], []),
    getAlbum: IDL.Func([IDL.Nat], [IDL.Opt(Album)], ['query']),
    getAllAlbums: IDL.Func([IDL.Principal], [IDL.Vec(Album)], ['query']),
    getAllGroups: IDL.Func([], [IDL.Vec(Group)], ['query']),
    getAllUserComparisons: IDL.Func([IDL.Principal], [IDL.Vec(TripComparison)], ['query']),
    getCallerUserProfile: IDL.Func([], [IDL.Opt(UserProfile)], ['query']),
    getCallerUserRole: IDL.Func([], [UserRole], ['query']),
    getGroup: IDL.Func([IDL.Nat], [IDL.Opt(Group)], ['query']),
    getUserProfile: IDL.Func([IDL.Principal], [IDL.Opt(UserProfile)], ['query']),
    isCallerAdmin: IDL.Func([], [IDL.Bool], ['query']),
    leaveGroup: IDL.Func([IDL.Nat], [], []),
    removeFriend: IDL.Func([IDL.Nat], [], []),
    saveCallerUserProfile: IDL.Func([UserProfile], [], []),
    setParentPermissionStatus: IDL.Func([IDL.Bool], [], []),
    uploadPhotoToAlbum: IDL.Func([IDL.Nat, PhotoInput], [], []),
    _initializeAccessControlWithSecret: IDL.Func([IDL.Text], [], []),
  });
};
