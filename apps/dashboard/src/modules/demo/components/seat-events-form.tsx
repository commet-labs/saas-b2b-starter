"use client";

import { useActionState, useState } from "react";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Loader2, Plus, Minus } from "lucide-react";
import { addSeatsToOrg, removeSeatsFromOrg } from "../actions/demo-actions";
import type { ActionState } from "@/modules/shared/lib/middleware-action";
import type { DemoOrganization } from "../lib/get-demo-organizations";

interface SeatEventsFormProps {
  organizations: DemoOrganization[];
}

const initialState: ActionState = {
  success: false,
  message: "",
};

export function SeatEventsForm({ organizations }: SeatEventsFormProps) {
  const [selectedOrg, setSelectedOrg] = useState<string>("");
  const [seatType, setSeatType] = useState<string>("admin_seat");

  const [addState, addFormAction, isAddPending] = useActionState(
    addSeatsToOrg,
    initialState,
  );

  const [removeState, removeFormAction, isRemovePending] = useActionState(
    removeSeatsFromOrg,
    initialState,
  );

  const isPending = isAddPending || isRemovePending;
  const state = addState.message ? addState : removeState;

  if (organizations.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Create some customers first to manage seats
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="org-select">Organization</Label>
        <Select value={selectedOrg} onValueChange={setSelectedOrg}>
          <SelectTrigger id="org-select">
            <SelectValue placeholder="Select organization" />
          </SelectTrigger>
          <SelectContent>
            {organizations.map((org) => (
              <SelectItem key={org.id} value={org.id}>
                {org.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="seat-type">Seat Type</Label>
          <Select value={seatType} onValueChange={setSeatType}>
            <SelectTrigger id="seat-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin_seat">Admin Seat</SelectItem>
              <SelectItem value="editor_seat">Editor Seat</SelectItem>
              <SelectItem value="viewer_seat">Viewer Seat</SelectItem>
              <SelectItem value="api_key">API Key</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="seat-quantity">Quantity</Label>
          <Input
            id="seat-quantity"
            name="quantity"
            type="number"
            min="1"
            max="100"
            defaultValue="5"
            disabled={isPending}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <form action={addFormAction} className="flex-1">
          <input type="hidden" name="orgId" value={selectedOrg} />
          <input type="hidden" name="seatType" value={seatType} />
          <input
            type="hidden"
            name="quantity"
            value={
              (document.getElementById("seat-quantity") as HTMLInputElement)
                ?.value || "5"
            }
          />
          <Button
            type="submit"
            disabled={isPending || !selectedOrg}
            className="w-full"
          >
            {isAddPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Add Seats
          </Button>
        </form>

        <form action={removeFormAction} className="flex-1">
          <input type="hidden" name="orgId" value={selectedOrg} />
          <input type="hidden" name="seatType" value={seatType} />
          <input
            type="hidden"
            name="quantity"
            value={
              (document.getElementById("seat-quantity") as HTMLInputElement)
                ?.value || "5"
            }
          />
          <Button
            type="submit"
            disabled={isPending || !selectedOrg}
            variant="outline"
            className="w-full"
          >
            {isRemovePending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Minus className="h-4 w-4 mr-2" />
            )}
            Remove Seats
          </Button>
        </form>
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
    </div>
  );
}
