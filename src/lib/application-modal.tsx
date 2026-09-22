import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { ApplicationModal, type PlanKey, type ExamKey } from "@/components/ApplicationModal";

type OpenOptions = {
  // Row id from `guidance_preview_responses`. Set when the student arrives from
  // the Free Guidance Preview, so the lead the modal creates points back to
  // their answers and stored full note.
  guidancePreviewId?: string;
};

type Ctx = {
  open: (plan?: PlanKey, exam?: ExamKey, options?: OpenOptions) => void;
};

const ApplicationModalContext = createContext<Ctx | null>(null);

export function ApplicationModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [plan, setPlan] = useState<PlanKey | undefined>(undefined);
  const [exam, setExam] = useState<ExamKey | undefined>(undefined);
  const [guidancePreviewId, setGuidancePreviewId] = useState<string | undefined>(undefined);

  const open = useCallback((p?: PlanKey, e?: ExamKey, options?: OpenOptions) => {
    setPlan(p);
    setExam(e);
    setGuidancePreviewId(options?.guidancePreviewId);
    setIsOpen(true);
  }, []);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <ApplicationModalContext.Provider value={value}>
      {children}
      <ApplicationModal open={isOpen} onOpenChange={setIsOpen} initialPlan={plan} initialExam={exam}
        guidancePreviewId={guidancePreviewId} />
    </ApplicationModalContext.Provider>
  );
}

export function useApplicationModal() {
  const ctx = useContext(ApplicationModalContext);
  if (!ctx) throw new Error("useApplicationModal must be used within ApplicationModalProvider");
  return ctx;
}
