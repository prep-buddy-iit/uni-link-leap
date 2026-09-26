import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Retired page.
 *
 * /find-a-mentor used to be a browsable mentor directory, which implied
 * students pick their own mentor. They don't - we allot one. The roster now
 * appears as a showcase strip on /jee and /neet instead.
 *
 * This is a 301 rather than a deletion so any indexed URL, inbound link or
 * bookmark lands somewhere useful and passes its ranking signals on, instead
 * of turning into a 404. The redirect is thrown in beforeLoad so it happens
 * on the server during SSR and crawlers see a real HTTP 301.
 */
export const Route = createFileRoute("/find-a-mentor")({
  beforeLoad: () => {
    throw redirect({ to: "/", statusCode: 301 });
  },
});
