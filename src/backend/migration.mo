import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  type Bundle = {
    hotel : {
      name : Text;
      address : Text;
      city : Text;
      state : ?Text;
      country : Text;
      starRating : ?Float;
      reviews : ?Float;
      roomTypes : [{
        name : Text;
        description : ?Text;
        bedType : ?Text;
        occupancy : ?Nat;
        price : Float;
        amenities : [{
          name : Text;
          description : ?Text;
          category : {
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
        }];
        size : ?Nat;
        cancellationPolicy : ?Text;
        views : ?Text;
      }];
      amenities : [{
        name : Text;
        description : ?Text;
        category : {
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
      }];
      prices : ?{
        minPrice : Float;
        maxPrice : Float;
        currency : Text;
        rateType : {
          #perNight;
          #perWeek;
          #perMonth;
        };
      };
      brand : ?Text;
      location : ?{
        latitude : Float;
        longitude : Float;
      };
      imageUrls : ?[Text];
      checkInTime : ?Text;
      checkOutTime : ?Text;
    };
    roomType : {
      name : Text;
      description : ?Text;
      bedType : ?Text;
      occupancy : ?Nat;
      price : Float;
      amenities : [{
        name : Text;
        description : ?Text;
        category : {
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
      }];
      size : ?Nat;
      cancellationPolicy : ?Text;
      views : ?Text;
    };
    ticket : {
      id : Nat;
      name : Text;
      type_ : {
        #standard;
        #vip;
      };
      price : Float;
      currency : Text;
      available : Bool;
    };
  };

  type OldTripComparison = {
    id : Nat;
    userId : Principal;
    createdAt : Time.Time;
    event : Text;
    travelWindow : {
      checkIn : Time.Time;
      checkOut : Time.Time;
    };
    foundVIPPackage : Bool;
    ticketSources : [{
      id : Nat;
      name : Text;
      type_ : {
        #standard;
        #vip;
      };
      price : Float;
      currency : Text;
      available : Bool;
    }];
    vipPackageOptions : [{
      id : Nat;
      name : Text;
      price : Float;
      inclusions : [Text];
      currency : Text;
      exclusivePerks : ?Text;
    }];
    hotels : [{
      name : Text;
      address : Text;
      city : Text;
      state : ?Text;
      country : Text;
      starRating : ?Float;
      reviews : ?Float;
      roomTypes : [{
        name : Text;
        description : ?Text;
        bedType : ?Text;
        occupancy : ?Nat;
        price : Float;
        amenities : [{
          name : Text;
          description : ?Text;
          category : {
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
        }];
        size : ?Nat;
        cancellationPolicy : ?Text;
        views : ?Text;
      }];
      amenities : [{
        name : Text;
        description : ?Text;
        category : {
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
      }];
      prices : ?{
        minPrice : Float;
        maxPrice : Float;
        currency : Text;
        rateType : {
          #perNight;
          #perWeek;
          #perMonth;
        };
      };
      brand : ?Text;
      location : ?{
        latitude : Float;
        longitude : Float;
      };
      imageUrls : ?[Text];
      checkInTime : ?Text;
      checkOutTime : ?Text;
    }];
    bundles : [Bundle];
  };

  type NewTripComparison = {
    id : Nat;
    userId : Principal;
    createdAt : Time.Time;
    event : Text;
    travelWindow : {
      checkIn : Time.Time;
      checkOut : Time.Time;
    };
    foundVIPPackage : Bool;
    ticketSources : [{
      id : Nat;
      name : Text;
      type_ : {
        #standard;
        #vip;
      };
      price : Float;
      currency : Text;
      available : Bool;
    }];
    vipPackageOptions : [{
      id : Nat;
      name : Text;
      price : Float;
      inclusions : [Text];
      currency : Text;
      exclusivePerks : ?Text;
    }];
    hotels : [{
      name : Text;
      address : Text;
      city : Text;
      state : ?Text;
      country : Text;
      starRating : ?Float;
      reviews : ?Float;
      roomTypes : [{
        name : Text;
        description : ?Text;
        bedType : ?Text;
        occupancy : ?Nat;
        price : Float;
        amenities : [{
          name : Text;
          description : ?Text;
          category : {
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
        }];
        size : ?Nat;
        cancellationPolicy : ?Text;
        views : ?Text;
      }];
      amenities : [{
        name : Text;
        description : ?Text;
        category : {
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
      }];
      prices : ?{
        minPrice : Float;
        maxPrice : Float;
        currency : Text;
        rateType : {
          #perNight;
          #perWeek;
          #perMonth;
        };
      };
      brand : ?Text;
      location : ?{
        latitude : Float;
        longitude : Float;
      };
      imageUrls : ?[Text];
      checkInTime : ?Text;
      checkOutTime : ?Text;
    }];
    upgradeAlternatives : [Bundle];
    userChoice : ?Bundle;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, {
      name : Text;
      parentPermissionConfirmed : Bool;
      friends : [{
        id : Nat;
        principal : Principal;
        name : ?Text;
        isConfirmed : Bool;
      }];
    }>;
    tripComparisons : Map.Map<Principal, List.List<OldTripComparison>>;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, {
      name : Text;
      parentPermissionConfirmed : Bool;
      friends : [{
        id : Nat;
        principal : Principal;
        name : ?Text;
        isConfirmed : Bool;
      }];
    }>;
    tripComparisons : Map.Map<Principal, List.List<NewTripComparison>>;
  };

  public func run(old : OldActor) : NewActor {
    let newTripComparisons = old.tripComparisons.map<Principal, List.List<OldTripComparison>, List.List<NewTripComparison>>(
      func(_, oldList) {
        oldList.map(
          func(oldComparison) {
            let userChoice = switch (oldComparison.bundles.size()) {
              case (0) { null };
              case (_) { ?oldComparison.bundles[0] };
            };
            {
              oldComparison with
              upgradeAlternatives = [];
              userChoice;
            };
          }
        );
      }
    );
    {
      userProfiles = old.userProfiles;
      tripComparisons = newTripComparisons;
    };
  };
};
