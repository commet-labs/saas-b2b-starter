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
import { Loader2, Send, Layers } from "lucide-react";
import { sendUsageEvent, sendBatchUsageEvents } from "../actions/demo-actions";
import type { ActionState } from "@/modules/shared/lib/middleware-action";
import type { DemoOrganization } from "../lib/get-demo-organizations";

interface UsageEventsFormProps {
  organizations: DemoOrganization[];
}

const initialState: ActionState = {
  success: false,
  message: "",
};

export function UsageEventsForm({ organizations }: UsageEventsFormProps) {
  const [selectedOrg, setSelectedOrg] = useState<string>("");
  const [eventType, setEventType] = useState<string>("api_call");

  const [singleState, singleFormAction, isSinglePending] = useActionState(
    sendUsageEvent,
    initialState,
  );

  const [batchState, batchFormAction, isBatchPending] = useActionState(
    sendBatchUsageEvents,
    initialState,
  );

  const isPending = isSinglePending || isBatchPending;
  const state = singleState.message ? singleState : batchState;

  if (organizations.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Create some customers first to track usage
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="usage-org-select">Organization</Label>
        <Select value={selectedOrg} onValueChange={setSelectedOrg}>
          <SelectTrigger id="usage-org-select">
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

      <div className="space-y-2">
        <Label htmlFor="event-type">Event Type</Label>
        <Select value={eventType} onValueChange={setEventType}>
          <SelectTrigger id="event-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="api_call">API Call</SelectItem>
            <SelectItem value="payment_transaction">
              Payment Transaction
            </SelectItem>
            <SelectItem value="sms_notification">SMS Notification</SelectItem>
            <SelectItem value="analytics_usage">Analytics Usage</SelectItem>
            <SelectItem value="data_processing">Data Processing</SelectItem>
            <SelectItem value="user_activity">User Activity</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <form action={singleFormAction} className="space-y-4">
        <input type="hidden" name="orgId" value={selectedOrg} />
        <input type="hidden" name="eventType" value={eventType} />

        <div className="space-y-2">
          <Label htmlFor="usage-quantity">Quantity</Label>
          <Input
            id="usage-quantity"
            name="quantity"
            type="number"
            min="1"
            defaultValue="100"
            disabled={isPending}
          />
        </div>

        <Button
          type="submit"
          disabled={isPending || !selectedOrg}
          className="w-full"
        >
          {isSinglePending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          Send Single Event
        </Button>
      </form>

      <form action={batchFormAction} className="pt-4 border-t space-y-3">
        <input type="hidden" name="orgId" value={selectedOrg} />
        <input type="hidden" name="eventType" value={eventType} />

        <div className="space-y-2">
          <Label htmlFor="batch-count">Batch Count</Label>
          <Input
            id="batch-count"
            name="count"
            type="number"
            min="1"
            max="1000"
            defaultValue="10"
            disabled={isPending}
          />
        </div>

        <Button
          type="submit"
          disabled={isPending || !selectedOrg}
          variant="secondary"
          className="w-full"
        >
          {isBatchPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Layers className="h-4 w-4 mr-2" />
          )}
          Send Batch Events
        </Button>
      </form>

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
