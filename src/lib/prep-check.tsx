import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { ExamKey } from "@/components/ApplicationModal";

/**
 * Open/closed state for the floating prep check, so any CTA on the site can
 * launch it without owning the questionnaire.
 *
 * The answers themselves do not live here - they live in `usePreviewFlow`
 * inside the widget, which stays mounted for the whole session. This context
 * only decides whether the panel is on screen.
 */
export type PrepCheckStatus = "idle" | "in-progress" | "done";

type Ctx = {
  isOpen: boolean;
  /** Exam to pre-select, from a link such as /guidance-preview?exam=jee. */
  requestedExam?: ExamKey;
  open: (exam?: ExamKey) => void;
  close: () => void;
  /**
   * How far through the questionnaire the student is, so a page can offer to
   * resume rather than to start. Published by the widget - it changes a handful
   * of times a session, which is why it is safe to hold this high in the tree.
   */
  status: PrepCheckStatus;
  reportStatus: (status: PrepCheckStatus) => void;
};

/**
 * Deliberately a working default rather than `null`. The floating dock is
 * rendered from the root route and a missing provider should degrade to an
 * inert button, not throw the whole page away.
 */
const CLOSED: Ctx = {
  isOpen: false,
  open: () => {},
  close: () => {},
  status: "idle",
  reportStatus: () => {},
};

const PrepCheckContext = createContext<Ctx>(CLOSED);

export function PrepCheckProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [requestedExam, setRequestedExam] = useState<ExamKey | undefined>(undefined);
  const [status, setStatus] = useState<PrepCheckStatus>("idle");

  const open = useCallback((exam?: ExamKey) => {
    if (exam) setRequestedExam(exam);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const reportStatus = useCallback((next: PrepCheckStatus) => setStatus(next), []);

  const value = useMemo(
    () => ({ isOpen, requestedExam, open, close, status, reportStatus }),
    [isOpen, requestedExam, open, close, status, reportStatus],
  );

  return <PrepCheckContext.Provider value={value}>{children}</PrepCheckContext.Provider>;
}

export function usePrepCheck() {
  return useContext(PrepCheckContext);
}
