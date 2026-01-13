import { describe, it, expect } from "vitest";
import { buildEventTitle } from "./eventPrefix";
import { EVENT_STATUS } from "../repository/enums/eventStatus";
import { ATTENDEE_TYPE } from "../repository/enums/attendeeType";

describe("buildEventTitle", () => {
  it("CONFIRMEDステータスで[確定]プレフィックスが付くこと", () => {
    const result = buildEventTitle(
      "Test Event",
      EVENT_STATUS.CONFIRMED,
      ATTENDEE_TYPE.SPEAKER,
      false,
    );
    expect(result, "タイトルが正しいこと").toBe("[確定] Test Event");
  });

  it("TENTATIVEステータスで[仮]プレフィックスが付くこと", () => {
    const result = buildEventTitle(
      "Test Event",
      EVENT_STATUS.TENTATIVE,
      ATTENDEE_TYPE.SPEAKER,
      false,
    );
    expect(result, "タイトルが正しいこと").toBe("[仮] Test Event");
  });

  it("CANCELLEDステータスで[中止]プレフィックスが付くこと", () => {
    const result = buildEventTitle(
      "Test Event",
      EVENT_STATUS.CANCELLED,
      ATTENDEE_TYPE.SPEAKER,
      false,
    );
    expect(result, "タイトルが正しいこと").toBe("[中止] Test Event");
  });

  it("addRolePrefix=trueでSPEAKERの場合に[登壇]プレフィックスが付くこと", () => {
    const result = buildEventTitle(
      "Test Event",
      EVENT_STATUS.CONFIRMED,
      ATTENDEE_TYPE.SPEAKER,
      true,
    );
    expect(result, "タイトルが正しいこと").toBe("[確定] [登壇] Test Event");
  });

  it("addRolePrefix=trueでATTENDEEの場合に[参加]プレフィックスが付くこと", () => {
    const result = buildEventTitle(
      "Test Event",
      EVENT_STATUS.CONFIRMED,
      ATTENDEE_TYPE.ATTENDEE,
      true,
    );
    expect(result, "タイトルが正しいこと").toBe("[確定] [参加] Test Event");
  });

  it("addRolePrefix=falseでroleプレフィックスが付かないこと", () => {
    const result = buildEventTitle(
      "Test Event",
      EVENT_STATUS.CONFIRMED,
      ATTENDEE_TYPE.SPEAKER,
      false,
    );
    expect(result, "タイトルにroleプレフィックスが付かないこと").toBe("[確定] Test Event");
  });

  it("不明なstatusでエラーがスローされること", () => {
    expect(
      () => buildEventTitle("Test Event", "UNKNOWN" as never, ATTENDEE_TYPE.SPEAKER, false),
      "エラーがスローされること",
    ).toThrow("Unknown status: UNKNOWN");
  });

  it("不明なattendeeTypeでエラーがスローされること", () => {
    expect(
      () => buildEventTitle("Test Event", EVENT_STATUS.CONFIRMED, "UNKNOWN" as never, true),
      "エラーがスローされること",
    ).toThrow("Unknown attendeeType: UNKNOWN");
  });
});
