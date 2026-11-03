import { describe, expect, it } from "vitest";
import { detectSchoolChildren } from "../src/entities";
import type { Hass } from "../src/types";

const state = (entity_id: string, friendly_name: string) => ({ entity_id, state: "0", attributes: { friendly_name } });

function hass(): Hass {
  const states = [
    state("calendar.max_mustermann", "max.mustermann"),
    state("calendar.max_mustermann_homework", "max.mustermann Hausaufgaben"),
    state("calendar.max_mustermann_exam", "max.mustermann Prüfungen"),
    state("calendar.lena_m", "lena.m"),
    state("sensor.elternportal_letter_111", "Lena Letter"),
    state("sensor.elternportal_appointment_111", "Lena Appointment"),
    state("sensor.elternportal_letter_222", "Max Letter"),
  ];
  return {
    states: Object.fromEntries(states.map((s) => [s.entity_id, s])),
    entities: {
      "calendar.max_mustermann": { entity_id: "calendar.max_mustermann", platform: "webuntis", device_id: "d1", translation_key: "calendar" },
      "calendar.max_mustermann_homework": { entity_id: "calendar.max_mustermann_homework", platform: "webuntis", device_id: "d1", translation_key: "homework" },
      "calendar.max_mustermann_exam": { entity_id: "calendar.max_mustermann_exam", platform: "webuntis", device_id: "d1", translation_key: "exam" },
      "calendar.lena_m": { entity_id: "calendar.lena_m", platform: "webuntis", device_id: "d2", translation_key: "calendar" },
    },
    devices: { d1: { id: "d1", name: "max.mustermann" }, d2: { id: "d2", name: "lena.m" } },
    connection: {} as Hass["connection"],
  } as unknown as Hass;
}

describe("school children detection", () => {
  it("pairs WebUntis logins and Eltern-Portal students by first name", () => {
    expect(detectSchoolChildren(hass())).toEqual([
      { name: "Lena", timetable: "calendar.lena_m", letters: "sensor.elternportal_letter_111", appointments: "sensor.elternportal_appointment_111" },
      {
        name: "Max",
        timetable: "calendar.max_mustermann",
        homework: "calendar.max_mustermann_homework",
        exams: "calendar.max_mustermann_exam",
        letters: "sensor.elternportal_letter_222",
      },
    ]);
  });

  it("finds nothing without the integrations", () => {
    expect(detectSchoolChildren({ states: {}, connection: {} } as unknown as Hass)).toEqual([]);
  });
});
