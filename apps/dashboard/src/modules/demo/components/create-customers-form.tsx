"use client";

import { useState } from "react";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Loader2 } from "lucide-react";
import { createDemoOrganizations } from "../actions/demo-actions";
import type { DemoEvent } from "../lib/demo-utils";
import { createDemoEvent } from "../lib/demo-utils";

interface CreateCustomersFormProps {
  onEventCreated: (event: DemoEvent) => void;
  onRefresh: () => void;
}

export function CreateCustomersForm({
  onEventCreated,
  onRefresh,
}: CreateCustomersFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleCreate = async (count: number) => {
    setLoading(true);
    setMessage(null);

    try {
      const result = await createDemoOrganizations(count);

      if (result.success && result.data) {
        setMessage({
          type: "success",
          text: result.message || `Created ${count} customers`,
        });

        // Create events for each org created
        for (const org of result.data as Array<{ id: string; name: string }>) {
          onEventCreated(
            createDemoEvent(
              "customer",
              "customer_created",
              org.name,
              org.id,
              "Customer created in Commet",
            ),
          );
        }

        onRefresh();
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to create customers",
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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="quantity">Number of Customers</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          max="100"
          value={quantity}
          onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
          disabled={loading}
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button onClick={() => handleCreate(1)} disabled={loading} size="sm">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Create 1
        </Button>
        <Button
          onClick={() => handleCreate(10)}
          disabled={loading}
          variant="outline"
          size="sm"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Create 10
        </Button>
        <Button
          onClick={() => handleCreate(50)}
          disabled={loading}
          variant="outline"
          size="sm"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Create 50
        </Button>
        <Button
          onClick={() => handleCreate(quantity)}
          disabled={loading}
          variant="secondary"
          size="sm"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Create {quantity}
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
