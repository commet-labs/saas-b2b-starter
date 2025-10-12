"use client";

import { useState } from "react";
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
import type { DemoEvent } from "../lib/demo-utils";
import { createDemoEvent } from "../lib/demo-utils";

interface UsageEventsFormProps {
  organizations: Array<{ id: string; name: string }>;
  onEventCreated: (event: DemoEvent) => void;
}

export function UsageEventsForm({
  organizations,
  onEventCreated,
}: UsageEventsFormProps) {
  const [selectedOrg, setSelectedOrg] = useState<string>("");
  const [eventType, setEventType] = useState<
    | "api_call"
    | "payment_transaction"
    | "sms_notification"
    | "analytics_usage"
    | "data_processing"
    | "user_activity"
  >("api_call");
  const [quantity, setQuantity] = useState(100);
  const [batchCount, setBatchCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSendSingle = async () => {
    if (!selectedOrg) {
      setMessage({ type: "error", text: "Please select an organization" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await sendUsageEvent(selectedOrg, eventType, quantity);

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message || "Usage event sent",
        });

        const org = organizations.find((o) => o.id === selectedOrg);
        if (org) {
          onEventCreated(
            createDemoEvent(
              "usage",
              "usage_tracked",
              org.name,
              org.id,
              `${quantity}x ${eventType}`,
            ),
          );
        }
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to send usage event",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendBatch = async () => {
    if (!selectedOrg) {
      setMessage({ type: "error", text: "Please select an organization" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await sendBatchUsageEvents(
        selectedOrg,
        eventType,
        batchCount,
      );

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message || "Batch usage events sent",
        });

        const org = organizations.find((o) => o.id === selectedOrg);
        if (org) {
          onEventCreated(
            createDemoEvent(
              "usage",
              "batch_usage_tracked",
              org.name,
              org.id,
              `${batchCount}x ${eventType} (batch)`,
            ),
          );
        }
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to send batch usage events",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

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
        <Select
          value={eventType}
          onValueChange={(value) =>
            setEventType(
              value as
                | "api_call"
                | "payment_transaction"
                | "sms_notification"
                | "analytics_usage"
                | "data_processing"
                | "user_activity",
            )
          }
        >
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

      <div className="space-y-2">
        <Label htmlFor="usage-quantity">Quantity</Label>
        <Input
          id="usage-quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
          disabled={loading}
        />
      </div>

      <Button
        onClick={handleSendSingle}
        disabled={loading || !selectedOrg}
        className="w-full"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Send className="h-4 w-4 mr-2" />
        )}
        Send Single Event
      </Button>

      <div className="pt-4 border-t space-y-3">
        <div className="space-y-2">
          <Label htmlFor="batch-count">Batch Count</Label>
          <Input
            id="batch-count"
            type="number"
            min="1"
            max="1000"
            value={batchCount}
            onChange={(e) =>
              setBatchCount(Number.parseInt(e.target.value) || 1)
            }
            disabled={loading}
          />
        </div>

        <Button
          onClick={handleSendBatch}
          disabled={loading || !selectedOrg}
          variant="secondary"
          className="w-full"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Layers className="h-4 w-4 mr-2" />
          )}
          Send {batchCount} Events (Batch)
        </Button>
      </div>

      {message && (
        <div
          className={`text-sm p-3 rounded ${
            message.type === "success"
              ? "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400"
              : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
