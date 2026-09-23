import { teamChatUrl } from "@/lib/whatsapp";
import { usePrepCheck } from "@/lib/prep-check";

const WHATSAPP_URL = teamChatUrl("Hi! I want to know more about your mentorship program.");

/**
 * Persistent contact affordance. Deliberately static: no entrance animation, no
 * press-scale, no timers - it's a utility that should simply be there, and a
 * widget that animates itself in on every page load is the thing that makes a
 * site feel templated.
 *
 * It lives in the bottom-LEFT corner, opposite the prep check launcher. Two
 * round buttons stacked in the same corner read as one cluttered blob and each
 * makes the other easier to ignore; split apart, both are legible. It steps
 * aside entirely while the prep check panel is open, since the panel's dimmed
 * overlay would otherwise leave a blurred green smudge behind it.
 */
export function FloatingWhatsAppButton() {
  const { isOpen } = usePrepCheck();
  if (isOpen) return null;

  return (
    <div className="group fixed bottom-5 left-4 z-50 flex items-center sm:bottom-6 sm:left-6">
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full transition-colors duration-150 hover:bg-[#1fb055] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
        style={{
          backgroundColor: "#25D366",
          boxShadow: "0 10px 28px -10px rgba(26, 26, 46, 0.35)",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-7 w-7 text-white"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.125.297-.323.446-.484.148-.162.197-.297.298-.496.099-.198.05-.371-.025-.52-.075-.149-.67-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      {/* The label sits to the right now that the button hugs the left edge. */}
      <span
        className="pointer-events-none ml-3 hidden whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-[var(--shadow-glass)] transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100 sm:block"
        aria-hidden="true"
      >
        Chat with us on WhatsApp
      </span>
    </div>
  );
}
