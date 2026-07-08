import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { ApplicationModal, type PlanKey } from "@/components/ApplicationModal";

type Ctx = {
  open: (plan?: PlanKey) => void;
};

const ApplicationModalContext = createContext<Ctx | null>(null);

export function ApplicationModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [plan, setPlan] = useState<PlanKey | undefined>(undefined);

  const open = useCallback((p?: PlanKey) => {
    setPlan(p);
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
      />
    </ApplicationModalContext.Provider>
  );
}

export function useApplicationModal() {
  const ctx = useContext(ApplicationModalContext);
  if (!ctx) throw new Error("useApplicationModal must be used within ApplicationModalProvider");
  return ctx;
}
