import HashMap "mo:base/HashMap";
import AssocList "mo:base/AssocList";
import List "mo:base/List";
import Array "mo:base/Array";
import Map "mo:base/HashMap";
import Principal "mo:base/Principal";
import Option "mo:base/Option";
import Debug "mo:base/Debug";
import Float "mo:base/Float";
import Text "mo:base/Text";

// type UsersMap = AssocList.AssocList<Principal, User>;
// type DriversMap = AssocList.AssocList<Principal, Driver>;

actor {
    type Coordinates = {
        latitude : Text;
        longitude : Text
    };
    type Ride = {
        pickUpLocation : Text;
        dropLocation : Text;
        pickUpLocationCoordinates : Coordinates;
        dropLocationCoordinates : Coordinates;
        distance : Nat;
        fare : Float;
        user : ?Text;

    };
    type Status = { #Driver; #User };
    type User = {
        status : Status;
        firstName : Text;
        lastName : Text;
        email : Text;
        mobileNumber : Text
    };
    type Driver = {
        car : Text;
        driverLicense : Text;
        vehicleLicense : Text
    };

    var users = Map.HashMap<Principal, User>(0, Principal.equal, Principal.hash);

    var drivers = Map.HashMap<Principal, Driver>(0, Principal.equal, Principal.hash);

    var usersRide = List.nil<Ride>();

    private func boolToText(b : Bool) : Text {
        if (b) {
            "true"
        } else {
            "false"
        }
    };

    private func is_user_registered(principal : Principal) : Bool {
        Option.isSome(users.get(principal))
    };

    private func is_driver_registered(principal : Principal) : Bool {
        Option.isSome(drivers.get(principal))
    };

    public shared func registerUser(user : User, userId : Text) : async () {
        let caller = Principal.fromText(userId);
        Debug.print(debug_show (Principal.isAnonymous(caller)));
        Debug.print(debug_show (boolToText(is_user_registered(caller)) # "This is the is userre"));
        assert not Principal.isAnonymous(caller);
        assert false == is_user_registered(caller);
        users.put(caller, user)
    };

    public shared func registerDriver(driver : Driver, userId : Text) : async () {
        let caller = Principal.fromText(userId);
        Debug.print(debug_show (Principal.isAnonymous(caller)));
        Debug.print(debug_show (boolToText(is_driver_registered(caller)) # "driver registered"));
        assert not Principal.isAnonymous(caller);
        assert false == is_driver_registered(caller);
        drivers.put(caller, driver)
    };

    public shared func bookRide(ride : Ride) : async () {
        usersRide := List.push(ride, usersRide)
    };
    public query ({ caller }) func getUserDetails() : async ?User {

        Debug.print(debug_show (caller));
        users.get(caller)
    };
    public query func getUserDetailsFromPrincipalText(principalText : Text) : async ?User {
        users.get(Principal.fromText(principalText))
    };
    public query ({ caller }) func whoami() : async Principal {
        return caller
    }

}
