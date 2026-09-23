/**
 * WhatsApp destinations, in one place.
 *
 * The two community group links are the only values that need swapping when the
 * real invites exist — one line each, no hunting through components.
 */

// TODO: replace with the real JEE community invite link (https://chat.whatsapp.com/XXXXXXXX).
export const WHATSAPP_JEE_GROUP_URL = "REPLACE_ME";

// TODO: replace with the real NEET community invite link (https://chat.whatsapp.com/XXXXXXXX).
export const WHATSAPP_NEET_GROUP_URL = "REPLACE_ME";

/** The team's WhatsApp number, used for 1:1 chats and as the community fallback. */
export const WHATSAPP_TEAM_PHONE = "917428655600";

/** The same number, formatted for display, and as a tel: href. */
export const CONTACT_PHONE_DISPLAY = "+91 74286 55600";
export const CONTACT_PHONE_TEL = "+917428655600";

const INVITE_PREFIX = "https://chat.whatsapp.com/";

/** True once a group constant above has been filled in with a real invite link. */
export function hasGroupInvite(url: string): boolean {
  return url.startsWith(INVITE_PREFIX) && url.length > INVITE_PREFIX.length;
}

/**
 * A 1:1 chat with the team, with the message prefilled.
 *
 * wa.me resolves correctly on both mobile and desktop, so the href is identical
 * on the server and in the browser — no user-agent sniffing, no hydration drift.
 */
export function teamChatUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_TEAM_PHONE}?text=${encodeURIComponent(message)}`;
}

/**
 * Where a community "Join" button should point.
 *
 * Until the real invite is set above, this sends the student to the team's
 * WhatsApp with a prefilled request, rather than to a generic WhatsApp landing
 * page that goes nowhere.
 */
export function communityJoinUrl(groupUrl: string, examLabel: string): string {
  return hasGroupInvite(groupUrl)
    ? groupUrl
    : teamChatUrl(
        `Hi! Please send me the invite link for the PrepBuddy ${examLabel} WhatsApp community.`,
      );
}
