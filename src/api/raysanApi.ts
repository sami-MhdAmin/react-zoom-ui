import { http } from "./http";

/**
 * Raysan API wrapper.
 *
 * This file is intentionally small: each function maps to one backend endpoint.
 * If your backend changes, you update it here (not across UI components).
 */

export type HealthResponse = {
  ok: boolean;
  service: string;
  timestamp: string;
  uptimeSeconds: number;
};

// Zoom's API shape can be large; for this beginner app we'll keep meeting type flexible.
export type ZoomMeeting = Record<string, unknown>;

export type CreateMeetingInput = {
  topic: string;
  date: string; // example: "2026-04-30"
  time: string; // example: "14:30"
};

export const raysanApi = {
  health() {
    return http.get<HealthResponse>("/health");
  },

  listMeetings() {
    return http.get<ZoomMeeting>("/meetings");
  },

  createMeeting(input: CreateMeetingInput) {
    return http.post<ZoomMeeting>("/meetings", input);
  },

  deleteMeeting(meetingId: string) {
    return http.del(`/meetings/${encodeURIComponent(meetingId)}`);
  },
};

