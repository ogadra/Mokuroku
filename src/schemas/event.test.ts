import { describe, it, expect } from "vitest";
import * as v from "valibot";
import { createEventSchema, updateEventSchema } from "./event";
import { EVENT_STATUS } from "../repository/enums/eventStatus";
import { EVENT_CLASS } from "../repository/enums/eventClass";
import { ATTENDEE_TYPE } from "../repository/enums/attendeeType";

const validEvent = {
  summary: "Test Event",
  dtstart: "2026-05-01T10:00:00+09:00",
  dtend: "2026-05-01T12:00:00+09:00",
  description: "Test Description",
  location: "Test Location",
  status: EVENT_STATUS.CONFIRMED,
  class: EVENT_CLASS.PUBLIC,
  attendeeType: ATTENDEE_TYPE.SPEAKER,
};

describe("createEventSchema", () => {
  it("全フィールド有効な入力でsuccess=trueとなり同一の出力を返すこと", () => {
    const result = v.safeParse(createEventSchema, validEvent);
    expect(result.success, "successがtrueであること").toBe(true);
    if (result.success) {
      expect(result.output, "outputが入力と同一であること").toStrictEqual(validEvent);
    }
  });

  it("classフィールドを省略してもsuccess=trueとなること", () => {
    const { class: _omitted, ...input } = validEvent;
    const result = v.safeParse(createEventSchema, input);
    expect(result.success, "classなしでsuccessがtrueであること").toBe(true);
    if (result.success) {
      expect(result.output, "outputが入力と同一であること").toStrictEqual(input);
    }
  });

  it("summaryが欠落するとsuccess=falseとなること", () => {
    const { summary: _omitted, ...input } = validEvent;
    const result = v.safeParse(createEventSchema, input);
    expect(result.success, "summary欠落でsuccessがfalseであること").toBe(false);
  });

  it("dtstartが欠落するとsuccess=falseとなること", () => {
    const { dtstart: _omitted, ...input } = validEvent;
    const result = v.safeParse(createEventSchema, input);
    expect(result.success, "dtstart欠落でsuccessがfalseであること").toBe(false);
  });

  it("dtendが欠落するとsuccess=falseとなること", () => {
    const { dtend: _omitted, ...input } = validEvent;
    const result = v.safeParse(createEventSchema, input);
    expect(result.success, "dtend欠落でsuccessがfalseであること").toBe(false);
  });

  it("descriptionが欠落するとsuccess=falseとなること", () => {
    const { description: _omitted, ...input } = validEvent;
    const result = v.safeParse(createEventSchema, input);
    expect(result.success, "description欠落でsuccessがfalseであること").toBe(false);
  });

  it("locationが欠落するとsuccess=falseとなること", () => {
    const { location: _omitted, ...input } = validEvent;
    const result = v.safeParse(createEventSchema, input);
    expect(result.success, "location欠落でsuccessがfalseであること").toBe(false);
  });

  it("statusが欠落するとsuccess=falseとなること", () => {
    const { status: _omitted, ...input } = validEvent;
    const result = v.safeParse(createEventSchema, input);
    expect(result.success, "status欠落でsuccessがfalseであること").toBe(false);
  });

  it("attendeeTypeが欠落するとsuccess=falseとなること", () => {
    const { attendeeType: _omitted, ...input } = validEvent;
    const result = v.safeParse(createEventSchema, input);
    expect(result.success, "attendeeType欠落でsuccessがfalseであること").toBe(false);
  });

  it("summaryが文字列以外の場合にsuccess=falseとなること", () => {
    const result = v.safeParse(createEventSchema, { ...validEvent, summary: 123 });
    expect(result.success, "summaryが数値でsuccessがfalseであること").toBe(false);
  });

  it("dtstartがタイムゾーンなしの場合にsuccess=falseとなること", () => {
    const result = v.safeParse(createEventSchema, {
      ...validEvent,
      dtstart: "2026-05-01T10:00:00",
    });
    expect(result.success, "タイムゾーンなしでsuccessがfalseであること").toBe(false);
  });

  it("dtstartがZ終端の場合にsuccess=trueとなること", () => {
    const result = v.safeParse(createEventSchema, {
      ...validEvent,
      dtstart: "2026-05-01T10:00:00Z",
    });
    expect(result.success, "Z終端でsuccessがtrueであること").toBe(true);
  });

  it("dtstartが正のオフセット（+09:00）の場合にsuccess=trueとなること", () => {
    const result = v.safeParse(createEventSchema, {
      ...validEvent,
      dtstart: "2026-05-01T10:00:00+09:00",
    });
    expect(result.success, "+09:00でsuccessがtrueであること").toBe(true);
  });

  it("dtstartが負のオフセット（-05:00）の場合にsuccess=trueとなること", () => {
    const result = v.safeParse(createEventSchema, {
      ...validEvent,
      dtstart: "2026-05-01T10:00:00-05:00",
    });
    expect(result.success, "-05:00でsuccessがtrueであること").toBe(true);
  });

  it("dtstartが不正な形式の場合にsuccess=falseとなること", () => {
    const result = v.safeParse(createEventSchema, {
      ...validEvent,
      dtstart: "not-a-date",
    });
    expect(result.success, "不正な形式でsuccessがfalseであること").toBe(false);
  });

  it("dtendがタイムゾーンなしの場合にsuccess=falseとなること", () => {
    const result = v.safeParse(createEventSchema, {
      ...validEvent,
      dtend: "2026-05-01T12:00:00",
    });
    expect(result.success, "dtendがタイムゾーンなしでsuccessがfalseであること").toBe(false);
  });

  it("statusがTENTATIVEの場合にsuccess=trueとなること", () => {
    const result = v.safeParse(createEventSchema, {
      ...validEvent,
      status: EVENT_STATUS.TENTATIVE,
    });
    expect(result.success, "TENTATIVEでsuccessがtrueであること").toBe(true);
  });

  it("statusがCONFIRMEDの場合にsuccess=trueとなること", () => {
    const result = v.safeParse(createEventSchema, {
      ...validEvent,
      status: EVENT_STATUS.CONFIRMED,
    });
    expect(result.success, "CONFIRMEDでsuccessがtrueであること").toBe(true);
  });

  it("statusがCANCELLEDの場合にsuccess=trueとなること", () => {
    const result = v.safeParse(createEventSchema, {
      ...validEvent,
      status: EVENT_STATUS.CANCELLED,
    });
    expect(result.success, "CANCELLEDでsuccessがtrueであること").toBe(true);
  });

  it("statusが列挙外の値の場合にsuccess=falseとなること", () => {
    const result = v.safeParse(createEventSchema, { ...validEvent, status: "UNKNOWN" });
    expect(result.success, "列挙外statusでsuccessがfalseであること").toBe(false);
  });

  it("classがPUBLICの場合にsuccess=trueとなること", () => {
    const result = v.safeParse(createEventSchema, {
      ...validEvent,
      class: EVENT_CLASS.PUBLIC,
    });
    expect(result.success, "PUBLICでsuccessがtrueであること").toBe(true);
  });

  it("classがPRIVATEの場合にsuccess=trueとなること", () => {
    const result = v.safeParse(createEventSchema, {
      ...validEvent,
      class: EVENT_CLASS.PRIVATE,
    });
    expect(result.success, "PRIVATEでsuccessがtrueであること").toBe(true);
  });

  it("classがCONFIDENTIALの場合にsuccess=trueとなること", () => {
    const result = v.safeParse(createEventSchema, {
      ...validEvent,
      class: EVENT_CLASS.CONFIDENTIAL,
    });
    expect(result.success, "CONFIDENTIALでsuccessがtrueであること").toBe(true);
  });

  it("classが列挙外の値の場合にsuccess=falseとなること", () => {
    const result = v.safeParse(createEventSchema, { ...validEvent, class: "UNKNOWN" });
    expect(result.success, "列挙外classでsuccessがfalseであること").toBe(false);
  });

  it("attendeeTypeがSPEAKERの場合にsuccess=trueとなること", () => {
    const result = v.safeParse(createEventSchema, {
      ...validEvent,
      attendeeType: ATTENDEE_TYPE.SPEAKER,
    });
    expect(result.success, "SPEAKERでsuccessがtrueであること").toBe(true);
  });

  it("attendeeTypeがATTENDEEの場合にsuccess=trueとなること", () => {
    const result = v.safeParse(createEventSchema, {
      ...validEvent,
      attendeeType: ATTENDEE_TYPE.ATTENDEE,
    });
    expect(result.success, "ATTENDEEでsuccessがtrueであること").toBe(true);
  });

  it("attendeeTypeが列挙外の値の場合にsuccess=falseとなること", () => {
    const result = v.safeParse(createEventSchema, { ...validEvent, attendeeType: "UNKNOWN" });
    expect(result.success, "列挙外attendeeTypeでsuccessがfalseであること").toBe(false);
  });
});

describe("updateEventSchema", () => {
  it("空オブジェクトでsuccess=trueとなること", () => {
    const result = v.safeParse(updateEventSchema, {});
    expect(result.success, "空オブジェクトでsuccessがtrueであること").toBe(true);
    if (result.success) {
      expect(result.output, "outputが空オブジェクトであること").toStrictEqual({});
    }
  });

  it("summaryのみの指定でsuccess=trueとなること", () => {
    const result = v.safeParse(updateEventSchema, { summary: "Updated" });
    expect(result.success, "summaryのみでsuccessがtrueであること").toBe(true);
    if (result.success) {
      expect(result.output, "outputがsummaryのみであること").toStrictEqual({ summary: "Updated" });
    }
  });

  it("全フィールド指定でsuccess=trueとなること", () => {
    const result = v.safeParse(updateEventSchema, validEvent);
    expect(result.success, "全フィールドでsuccessがtrueであること").toBe(true);
    if (result.success) {
      expect(result.output, "outputが入力と同一であること").toStrictEqual(validEvent);
    }
  });

  it("dtstartがタイムゾーンなしの場合にsuccess=falseとなること", () => {
    const result = v.safeParse(updateEventSchema, { dtstart: "2026-05-01T10:00:00" });
    expect(result.success, "タイムゾーンなしでsuccessがfalseであること").toBe(false);
  });

  it("statusが列挙外の値の場合にsuccess=falseとなること", () => {
    const result = v.safeParse(updateEventSchema, { status: "UNKNOWN" });
    expect(result.success, "列挙外statusでsuccessがfalseであること").toBe(false);
  });

  it("classが列挙外の値の場合にsuccess=falseとなること", () => {
    const result = v.safeParse(updateEventSchema, { class: "UNKNOWN" });
    expect(result.success, "列挙外classでsuccessがfalseであること").toBe(false);
  });

  it("attendeeTypeが列挙外の値の場合にsuccess=falseとなること", () => {
    const result = v.safeParse(updateEventSchema, { attendeeType: "UNKNOWN" });
    expect(result.success, "列挙外attendeeTypeでsuccessがfalseであること").toBe(false);
  });
});
