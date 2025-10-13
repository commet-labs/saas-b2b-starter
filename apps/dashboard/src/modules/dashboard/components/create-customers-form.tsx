"use client";

import { useActionState } from "react";
import { Button } from "@repo/ui/components/button";
import { Loader2 } from "lucide-react";
import { createDemoOrganizations } from "../actions/demo-actions";
import type { ActionState } from "@/modules/shared/lib/middleware-action";

const initialState: ActionState = {
  success: false,
  message: "",
};

export function CreateCustomersForm() {
  const [state, formAction, isPending] = useActionState(
    createDemoOrganizations,
    initialState,
  );

  return (
    <div className="space-y-4">
      <form action={formAction} className="space-y-4">
        <input id="count" name="count" type="hidden" defaultValue="1" />

        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            disabled={isPending}
            size="sm"
            variant="outline"
            onClick={(e) => {
              const form = e.currentTarget.form;
              if (form) {
                const input = form.elements.namedItem(
                  "count",
                ) as HTMLInputElement;
                input.value = "1";
              }
            }}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Create 1
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            variant="outline"
            size="sm"
            onClick={(e) => {
              const form = e.currentTarget.form;
              if (form) {
                const input = form.elements.namedItem(
                  "count",
                ) as HTMLInputElement;
                input.value = "10";
              }
            }}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Create 10
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            variant="outline"
            size="sm"
            onClick={(e) => {
              const form = e.currentTarget.form;
              if (form) {
                const input = form.elements.namedItem(
                  "count",
                ) as HTMLInputElement;
                input.value = "50";
              }
            }}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Create 50
          </Button>
        </div>

        {state.message && (
          <div
            className={`text-sm p-3 rounded ${
              state.success
                ? "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400"
                : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
            }`}
          >
            {state.message}
          </div>
        )}
      </form>
    </div>
  );
}
