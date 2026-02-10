import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Text "mo:core/Text";
import List "mo:core/List";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Nat32 "mo:core/Nat32";
import Nat "mo:core/Nat";
import Blob "mo:core/Blob";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// apply the migration function from the migration.mo file in with-clause

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var nextId = 0;

  module IdGenerator {
    public func generate(nextId : Nat) : Nat {
      nextId + 1;
    };
  };

  type Meta = {
    description : Text;
    createdBy : Principal;
    createdAt : Time.Time;
    lastModified : Time.Time;
    tags : [Text];
  };

  type GeoLocation = {
    latitude : Float;
    longitude : Float;
  };

  type Hotel = {
    name : Text;
    address : Text;
    city : Text;
    state : ?Text;
    country : Text;
    starRating : ?Float;
    reviews : ?Float;
    roomTypes : [RoomType];
    amenities : [Amenity];
    prices : ?PriceRange;
    brand : ?Text;
    location : ?GeoLocation;
    imageUrls : ?[Text];
    checkInTime : ?Text;
    checkOutTime : ?Text;
  };

  type RoomType = {
    name : Text;
    description : ?Text;
    bedType : ?Text;
    occupancy : ?Nat;
    price : Float;
    amenities : [Amenity];
    size : ?Nat;
    cancellationPolicy : ?Text;
    views : ?Text;
  };

  type Amenity = {
    name : Text;
    description : ?Text;
    category : AmenityCategory;
  };

  type AmenityCategory = {
    #roomFeatures;
    #hotelServices;
    #diningOptions;
    #recreationalFacilities;
    #businessServices;
    #accessibilityFeatures;
    #wellnessAndSpa;
    #transportation;
    #technology;
    #hospitalityServices;
    #safetyAndSecurity;
    #petFriendly;
    #entertainment;
  };

  type PriceRange = {
    minPrice : Float;
    maxPrice : Float;
    currency : Text;
    rateType : PriceType;
  };

  type PriceType = {
    #perNight;
    #perWeek;
    #perMonth;
  };

  type Ticket = {
    id : Nat;
    name : Text;
    type_ : TicketType;
    price : Float;
    currency : Text;
    available : Bool;
  };

  type TicketType = {
    #standard;
    #vip;
  };

  type VIPPackage = {
    id : Nat;
    name : Text;
    price : Float;
    inclusions : [Text];
    currency : Text;
    exclusivePerks : ?Text;
  };

  type Bundle = {
    hotel : Hotel;
    roomType : RoomType;
    ticket : Ticket;
  };

  type TripComparison = {
    id : Nat;
    userId : Principal;
    createdAt : Time.Time;
    event : Text;
    travelWindow : TravelWindow;
    foundVIPPackage : Bool;
    ticketSources : [Ticket];
    vipPackageOptions : [VIPPackage];
    hotels : [Hotel];
    bundles : [Bundle];
  };

  type TravelWindow = {
    checkIn : Time.Time;
    checkOut : Time.Time;
  };

  type ComparisonInput = {
    event : Text;
    travelWindow : TravelWindow;
    ticketSources : [Ticket];
    vipPackageOptions : [VIPPackage];
    hotels : [Hotel];
  };

  public type FriendEntry = {
    id : Nat;
    principal : Principal;
    name : ?Text;
    isConfirmed : Bool;
  };

  public type UserProfile = {
    name : Text;
    parentPermissionConfirmed : Bool;
    friends : [FriendEntry];
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func addFriendRequest(friendEntry : FriendEntry) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add friends");
    };

    let currentProfile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) { profile };
    };

    let updatedProfile = { currentProfile with friends = [friendEntry].concat(currentProfile.friends) };
    userProfiles.add(caller, updatedProfile);
  };

  public shared ({ caller }) func removeFriend(friendId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove friends");
    };

    let currentProfile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) { profile };
    };

    let filteredFriends = currentProfile.friends.filter(func(friend) { friend.id != friendId });
    let updatedProfile = { currentProfile with friends = filteredFriends };
    userProfiles.add(caller, updatedProfile);
  };

  public shared ({ caller }) func setParentPermissionStatus(hasPermission : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set parental permission status");
    };

    let currentProfile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) { profile };
    };

    let updatedProfile = { currentProfile with parentPermissionConfirmed = hasPermission };
    userProfiles.add(caller, updatedProfile);
  };

  module Hotel {
    public func compareByPriceAsc(hotel1 : Hotel, hotel2 : Hotel) : Order.Order {
      orderByPrice(hotel1, hotel2, Float.compare);
    };

    public func compareByPriceDesc(hotel1 : Hotel, hotel2 : Hotel) : Order.Order {
      orderByPrice(hotel1, hotel2, func(a, b) { Float.compare(b, a) });
    };
  };

  func orderByPrice(hotel1 : Hotel, hotel2 : Hotel, compareFunc : (Float, Float) -> Order.Order) : Order.Order {
    switch (hotel1.prices, hotel2.prices) {
      case (?prices1, ?prices2) { compareFunc(prices1.minPrice, prices2.minPrice) };
      case (?_, null) { #less };
      case (null, ?_) { #greater };
      case (null, null) { #equal };
    };
  };

  func createVIPBundleFromInputs(ticketSources : [Ticket], hotels : [Hotel]) : ?Bundle {
    let cheapStandardTicket = findCheapStandardTicket(ticketSources);
    switch (cheapStandardTicket) {
      case (null) { null };
      case (?ticket) {
        if (hotels.size() == 0) {
          null;
        } else {
          let affordableHotel = findAffordableHotel(hotels);
          if (affordableHotel.roomTypes.size() == 0) {
            null;
          } else {
            let roomType = selectAffordableRoom(affordableHotel.roomTypes);
            ?{ hotel = affordableHotel; roomType; ticket };
          };
        };
      };
    };
  };

  func findCheapStandardTicket(ticketSources : [Ticket]) : ?Ticket {
    var cheapest : ?Ticket = null;
    for (ticket in ticketSources.vals()) {
      if (ticket.type_ == #standard) {
        switch (cheapest) {
          case (null) { cheapest := ?ticket };
          case (?best) {
            if (ticket.price < best.price) {
              cheapest := ?ticket;
            };
          };
        };
      };
    };
    cheapest;
  };

  func findAffordableHotel(hotels : [Hotel]) : Hotel {
    let sortedHotels = hotels.sort(Hotel.compareByPriceAsc);
    sortedHotels[0];
  };

  func selectAffordableRoom(roomTypes : [RoomType]) : RoomType {
    let sortedRooms = roomTypes.sort(
      func(r1 : RoomType, r2 : RoomType) : Order.Order {
        Float.compare(r1.price, r2.price);
      },
    );
    sortedRooms[0];
  };

  let tripComparisons = Map.empty<Principal, List.List<TripComparison>>();

  public shared ({ caller }) func createTripComparison(input : ComparisonInput, foundVIPPackage : Bool) : async TripComparison {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save trip comparisons");
    };

    let newBundleId = IdGenerator.generate(nextId);
    nextId := newBundleId;
    let bundles = if (not foundVIPPackage) {
      switch (createVIPBundleFromInputs(input.ticketSources, input.hotels)) {
        case (?b) { [b] };
        case (null) { [] };
      };
    } else {
      switch (createVIPBundleFromInputs(input.ticketSources, input.hotels)) {
        case (?b) { [b] };
        case (null) { [] };
      };
    };

    let comparison = {
      id = newBundleId;
      userId = caller;
      createdAt = Time.now();
      event = input.event;
      travelWindow = input.travelWindow;
      foundVIPPackage;
      ticketSources = input.ticketSources;
      vipPackageOptions = input.vipPackageOptions;
      hotels = input.hotels;
      bundles;
    };

    let currentComparisons = switch (tripComparisons.get(caller)) {
      case (null) { List.empty<TripComparison>() };
      case (?existing) { existing };
    };
    currentComparisons.add(comparison);
    tripComparisons.add(caller, currentComparisons);
    comparison;
  };

  public query ({ caller }) func getAllUserComparisons(userId : Principal) : async [TripComparison] {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own comparisons");
    };

    switch (tripComparisons.get(userId)) {
      case (null) { [] };
      case (?comparisons) {
        comparisons.toArray();
      };
    };
  };

  public shared ({ caller }) func deleteComparison(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete comparisons");
    };

    let comparisons = switch (tripComparisons.get(caller)) {
      case (null) { Runtime.trap("No comparisons found") };
      case (?comparisons) { comparisons };
    };

    let filtered = comparisons.filter(func(cmp) { cmp.id != id });

    if (filtered.size() == comparisons.size()) {
      Runtime.trap("Comparison not found");
    };

    tripComparisons.add(caller, filtered);
  };

  // MEMORY FINDER FEATURE ----------------------------------------

  type PhotoTag = {
    principal : Principal;
    displayName : Text;
    position : (Float, Float);
  };

  type Photo = {
    id : Nat;
    imageUrl : Text;
    description : Text;
    tags : [PhotoTag];
    createdBy : Principal;
    createdAt : Time.Time;
    externalBlob : Storage.ExternalBlob;
  };

  type Album = {
    id : Nat;
    title : Text;
    creator : Principal;
    photos : [Photo];
    isShared : Bool;
  };

  type PhotoInput = {
    imageUrl : Text;
    description : Text;
    tags : [PhotoTag];
    externalBlob : Storage.ExternalBlob;
  };

  let albums = Map.empty<Nat, Album>();

  include MixinStorage();

  func isAlbumAccessible(album : Album, caller : Principal) : Bool {
    album.creator == caller or album.isShared or AccessControl.isAdmin(accessControlState, caller);
  };

  public shared ({ caller }) func createAlbum(title : Text) : async Album {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create albums");
    };
    let albumId = IdGenerator.generate(nextId);
    nextId := albumId;

    let newAlbum = {
      id = albumId;
      title;
      creator = caller;
      photos = [];
      isShared = false;
    };
    albums.add(albumId, newAlbum);
    newAlbum;
  };

  public shared ({ caller }) func uploadPhotoToAlbum(albumId : Nat, photo : PhotoInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload photos");
    };

    let album = switch (albums.get(albumId)) {
      case (null) { Runtime.trap("Album not found") };
      case (?a) { a };
    };

    if (album.creator != caller) {
      Runtime.trap("Unauthorized: Only album creator can upload photos");
    };

    let photoId = IdGenerator.generate(nextId);
    nextId := photoId;
    
    let newPhoto = {
      id = photoId;
      description = photo.description;
      tags = photo.tags;
      imageUrl = photo.imageUrl;
      createdAt = Time.now();
      createdBy = caller;
      externalBlob = photo.externalBlob;
    };

    var photosList = album.photos;
    photosList := [newPhoto].concat(photosList);
    let updatedAlbum = { album with photos = photosList };
    albums.add(albumId, updatedAlbum);
  };

  public shared ({ caller }) func deletePhotoFromAlbum(albumId : Nat, photoId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete photos");
    };

    let album = switch (albums.get(albumId)) {
      case (null) { Runtime.trap("Album not found") };
      case (?a) { a };
    };

    if (album.creator != caller) {
      Runtime.trap("Unauthorized: Only album creator can delete photos");
    };

    let filteredPhotos = album.photos.filter(func(photo) { photo.id != photoId });
    let updatedAlbum = { album with photos = filteredPhotos };
    albums.add(albumId, updatedAlbum);
  };

  public shared ({ caller }) func deleteAlbum(albumId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete albums");
    };

    let album = switch (albums.get(albumId)) {
      case (null) { Runtime.trap("Album not found") };
      case (?a) { a };
    };

    if (album.creator != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only album creator can delete albums");
    };

    albums.remove(albumId);
  };

  public query ({ caller }) func getAlbum(albumId : Nat) : async ?Album {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view albums");
    };

    switch (albums.get(albumId)) {
      case (null) { null };
      case (?album) {
        if (isAlbumAccessible(album, caller)) {
          ?album;
        } else {
          Runtime.trap("Unauthorized: Cannot access this album");
        };
      };
    };
  };

  public query ({ caller }) func getAllAlbums(userId : Principal) : async [Album] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view albums");
    };

    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own albums");
    };

    albums.values().filter(func(album) { album.creator == userId }).toArray();
  };

  // GROUPS (concert travelers - async chat) FEATURE -------------

  public type GroupMember = {
    id : Nat;
    principal : Principal;
    userName : Text;
    isConfirmed : Bool;
  };

  type Message = {
    id : Nat;
    author : ?GroupMember;
    content : Text;
    timestamp : Time.Time;
  };

  type Group = {
    id : Nat;
    comparisonId : ?Nat;
    groupName : Text;
    creator : Principal;
    members : [GroupMember];
    messages : [Message];
    createdAt : Time.Time;
    lastUpdate : Time.Time;
  };

  type NewMessage = {
    author : ?GroupMember;
    content : Text;
  };

  let groups = Map.empty<Nat, Group>();

  func isGroupMember(group : Group, caller : Principal) : Bool {
    group.members.find(func(member) { member.principal == caller }) != null;
  };

  public shared ({ caller }) func createGroup(
    groupName : Text,
    creator : Principal,
    members : [GroupMember],
    comparisonId : ?Nat,
  ) : async Group {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create groups");
    };

    if (caller != creator) {
      Runtime.trap("Unauthorized: Can only create groups for yourself");
    };

    let groupId = IdGenerator.generate(nextId);
    nextId := groupId;

    let newGroup = {
      lastUpdate = Time.now();
      groupName;
      members;
      messages = [];
      createdAt = Time.now();
      comparisonId;
      id = groupId;
      creator;
    };
    groups.add(groupId, newGroup);
    newGroup;
  };

  public query ({ caller }) func getGroup(groupId : Nat) : async ?Group {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view groups");
    };

    switch (groups.get(groupId)) {
      case (null) { null };
      case (?group) {
        if (isGroupMember(group, caller) or AccessControl.isAdmin(accessControlState, caller)) {
          ?group;
        } else {
          Runtime.trap("Unauthorized: Only group members can view this group");
        };
      };
    };
  };

  public query ({ caller }) func getAllGroups() : async [Group] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view groups");
    };

    groups.values().filter(
      func(group) {
        isGroupMember(group, caller) or AccessControl.isAdmin(accessControlState, caller);
      }
    ).toArray();
  };

  public shared ({ caller }) func addGroupMessage(groupId : Nat, message : NewMessage) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can post messages");
    };

    let group = switch (groups.get(groupId)) {
      case (null) { Runtime.trap("Group not found") };
      case (?g) { g };
    };

    if (not isGroupMember(group, caller)) {
      Runtime.trap("Unauthorized: Only group members can post messages");
    };

    let messageId = IdGenerator.generate(nextId);
    nextId := messageId;
    
    let newMessage = {
      id = messageId;
      author = message.author;
      content = message.content;
      timestamp = Time.now();
    };

    let updatedGroup = { 
      group with 
      messages = [newMessage].concat(group.messages);
      lastUpdate = Time.now();
    };
    groups.add(groupId, updatedGroup);
  };

  public shared ({ caller }) func leaveGroup(groupId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can leave groups");
    };

    let group = switch (groups.get(groupId)) {
      case (null) { Runtime.trap("Group not found") };
      case (?g) { g };
    };

    if (not isGroupMember(group, caller)) {
      Runtime.trap("Not a member of this group");
    };

    let filteredMembers = group.members.filter(func(member) { member.principal != caller });
    let updatedGroup = { group with members = filteredMembers };
    groups.add(groupId, updatedGroup);
  };
};

