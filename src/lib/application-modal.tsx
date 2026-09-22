import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { ApplicationModal, type PlanKey, type ExamKey } from "@/components/ApplicationModal";
import type { GuidancePreviewPayload } from "@/lib/guidance-preview/lead-note";

type OpenOptions = {
  // Carried in from the Free Guidance Preview result screen. Held in memory
  // only - it is written onto the lead this modal creates, so a student who
  // never signs up leaves no record.
  guidancePreview?: GuidancePreviewPayload;
};

type Ctx = {
  open: (plan?: PlanKey, exam?: ExamKey, options?: OpenOptions) => void;
};

const ApplicationModalContext = createContext<Ctx | null>(null);

export function ApplicationModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [plan, setPlan] = useState<PlanKey | undefined>(undefined);
  const [exam, setExam] = useState<ExamKey | undefined>(undefined);
  const [guidancePreview, setGuidancePreview] = useState<GuidancePreviewPayload | undefined>(
    undefined,
  );

  const open = useCallback((p?: PlanKey, e?: ExamKey, options?: OpenOptions) => {
    setPlan(p);
    setExam(e);
    setGuidancePreview(options?.guidancePreview);
    setIsOpen(true);
  }, []);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <ApplicationModalContext.Provider value={value}>
      {children}
      <ApplicationModal
        open={isOpen}
        onOpenChange={setIsOpen}
        initialPlan={plan}
        initialExam={exam}
        guidancePreview={guidancePreview}
      />
    </ApplicationModalContext.Provider>
  );
}

export function useApplicationModal() {
  const ctx = useContext(ApplicationModalContext);
  if (!ctx) throw new Error("useApplicationModal must be used within ApplicationModalProvider");
  return ctx;
}
