import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

actor {
  type Subject = {
    #AI;
    #Commerce;
    #Maths;
    #Computer;
  };

  module Subject {
    public func compare(subject1 : Subject, subject2 : Subject) : Order.Order {
      func toNat(subject : Subject) : Nat {
        switch (subject) {
          case (#AI) { 0 };
          case (#Commerce) { 1 };
          case (#Maths) { 2 };
          case (#Computer) { 3 };
        };
      };
      Nat.compare(toNat(subject1), toNat(subject2));
    };
  };

  type ScheduleEntry = {
    id : Nat;
    subject : Subject;
    startTime : Text;
    endTime : Text;
    note : ?Text;
  };

  module ScheduleEntry {
    public func compare(id1 : Nat, id2 : Nat) : Order.Order {
      Nat.compare(id1, id2);
    };
  };

  let scheduleEntries = Map.empty<Nat, ScheduleEntry>();
  var nextId = 0;

  func parseSubject(subjectText : Text) : Subject {
    switch (subjectText.toLower()) {
      case ("ai") { #AI };
      case ("commerce") { #Commerce };
      case ("maths") { #Maths };
      case ("computer") { #Computer };
      case (_) { Runtime.trap("Invalid subject: " # subjectText) };
    };
  };

  public shared ({ caller }) func addScheduleEntry(subjectText : Text, startTime : Text, endTime : Text, note : ?Text) : async ScheduleEntry {
    let subject = parseSubject(subjectText);
    let entry : ScheduleEntry = {
      id = nextId;
      subject;
      startTime;
      endTime;
      note;
    };
    scheduleEntries.add(nextId, entry);
    nextId += 1;
    entry;
  };

  public query ({ caller }) func getAllScheduleEntries() : async [ScheduleEntry] {
    scheduleEntries.values().toArray();
  };

  public shared ({ caller }) func updateScheduleEntry(id : Nat, subjectText : Text, startTime : Text, endTime : Text, note : ?Text) : async () {
    let subject = parseSubject(subjectText);
    if (not scheduleEntries.containsKey(id)) {
      Runtime.trap("Schedule entry with id " # id.toText() # " does not exist");
    };
    let entry : ScheduleEntry = {
      id;
      subject;
      startTime;
      endTime;
      note;
    };
    scheduleEntries.add(id, entry);
  };

  public shared ({ caller }) func deleteScheduleEntry(id : Nat) : async () {
    if (not scheduleEntries.containsKey(id)) {
      Runtime.trap("Schedule entry with id " # id.toText() # " does not exist");
    };
    scheduleEntries.remove(id);
  };

  public query ({ caller }) func getEntriesBySubject(subjectText : Text) : async [ScheduleEntry] {
    let subject = parseSubject(subjectText);
    scheduleEntries.values().toArray().filter(
      func(entry) {
        entry.subject == subject;
      }
    );
  };
};
