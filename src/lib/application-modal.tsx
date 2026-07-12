import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { ApplicationModal, type PlanKey, type ExamKey } from "@/components/ApplicationModal";

type Ctx = {
  open: (plan?: PlanKey, exam?: ExamKey) => void;
};

const ApplicationModalContext = createContext<Ctx | null>(null);

export function ApplicationModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [plan, setPlan] = useState<PlanKey | undefined>(undefined);
  const [exam, setExam] = useState<ExamKey | undefined>(undefined);

  const open = useCallback((p?: PlanKey, e?: ExamKey) => {
    setPlan(p);
    setExam(e);
    setIsOpen(true);
  }, []);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <ApplicationModalContext.Provider value={value}>
      {children}
      <ApplicationModal open={isOpen} onOpenChange={setIsOpen} initialPlan={plan} initialExam={exam} />
    </ApplicationModalContext.Provider>
  );
}

export function useApplicationModal() {
  const ctx = useContext(ApplicationModalContext);
  if (!ctx) throw new Error("useApplicationModal must be used within ApplicationModalProvider");
  return ctx;
}
