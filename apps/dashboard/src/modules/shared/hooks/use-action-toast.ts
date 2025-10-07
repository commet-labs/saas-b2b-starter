"use client";

import { useScopedI18n } from "@/locales/client";
import type { ActionState } from "@/modules/shared/lib/middleware-action";
import { toast } from "@repo/ui/components/sonner";
import { useActionState, useEffect, useRef } from "react";

/**
 * Hook that combines useActionState with automatic toast notifications
 * Shows loading toast while action is pending, then success/error toasts when completed
 * Uses fallback translations if no specific messages are provided
 */
export function useActionToast<TInput = FormData>(
  action: (prevState: ActionState, input: TInput) => Promise<ActionState>,
  initialState: ActionState = { success: false, message: "" },
  permalink?: string,
  loadingMessage?: string,
) {
  const [state, formAction, isPending] = useActionState(
    action,
    initialState,
    permalink,
  );

  const t = useScopedI18n("components.action_toast");
  const loadingToastId = useRef<string | number | null>(null);
  const wasLoading = useRef(false);
  const hasExecuted = useRef(false);

  // Handle loading state
  useEffect(() => {
    if (isPending && !wasLoading.current) {
      // Show loading toast when action starts - use provided message or fallback
      const message = loadingMessage || t("loading");
      loadingToastId.current = toast.loading(message);
      wasLoading.current = true;
      hasExecuted.current = true; // Mark that an action has been executed
    } else if (!isPending && wasLoading.current) {
      // Dismiss loading toast when action completes
      if (loadingToastId.current) {
        toast.dismiss(loadingToastId.current);
        loadingToastId.current = null;
      }
      wasLoading.current = false;
    }
  }, [isPending, loadingMessage, t]);

  // Show success/error toast when action completes
  useEffect(() => {
    // Only show toasts if an action has been executed (not on initial render)
    if (!isPending && wasLoading.current === false && hasExecuted.current) {
      if (state.success) {
        // Use provided message or fallback success message
        const message = state.message || t("success");
        toast.success(message);
      } else if (!state.success) {
        // Use provided message or fallback error message
        const message = state.message || t("error");
        toast.error(message);
      }
    }
  }, [state, isPending, t]);

  // Cleanup loading toast on unmount
  useEffect(() => {
    return () => {
      if (loadingToastId.current) {
        toast.dismiss(loadingToastId.current);
      }
    };
  }, []);

  return [state, formAction, isPending] as const;
}
