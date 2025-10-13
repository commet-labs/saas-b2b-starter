"use client";

import { useActionToast } from "@/modules/shared/hooks/use-action-toast";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { createOrganization } from "../actions/organization-action";

export function CreateOrganizationForm() {
  const [state, formAction, isPending] = useActionToast(createOrganization, {
    success: false,
    message: "",
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Create your first organization
            </h1>
            <p className="text-muted-foreground mt-2">
              To get started, you need to create an organization where you can
              manage your projects and billing.
            </p>
          </div>

          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="name" className="block text-sm font-medium mb-2">
                Organization name
              </Label>
              <Input
                type="text"
                name="name"
                id="name"
                required
                placeholder="My company"
                disabled={isPending}
              />
              {state?.errors?.name && (
                <p className="text-red-500 text-sm mt-1">
                  {state.errors.name[0]}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Creating..." : "Create organization"}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Once created, you will be automatically redirected to your
              organization dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
