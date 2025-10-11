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
import { Loader2, Plus, Minus } from "lucide-react";
import { addSeatsToOrg, removeSeatsFromOrg } from "../actions/demo-actions";
import type { DemoEvent } from "../lib/demo-utils";
import { createDemoEvent } from "../lib/demo-utils";

interface SeatEventsFormProps {
  organizations: Array<{ id: string; name: string }>;
  onEventCreated: (event: DemoEvent) => void;
}

export function SeatEventsForm({
  organizations,
  onEventCreated,
}: SeatEventsFormProps) {
  const [selectedOrg, setSelectedOrg] = useState<string>("");
  const [seatType, setSeatType] = useState<"admin" | "user" | "viewer">("user");
  const [quantity, setQuantity] = useState(5);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSeatAction = async (action: "add" | "remove") => {
    if (!selectedOrg) {
      setMessage({ type: "error", text: "Please select an organization" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result =
        action === "add"
          ? await addSeatsToOrg(selectedOrg, seatType, quantity)
          : await removeSeatsFromOrg(selectedOrg, seatType, quantity);

      if (result.success) {
        setMessage({
          type: "success",
          text:
            result.message || `${action === "add" ? "Added" : "Removed"} seats`,
        });

        const org = organizations.find((o) => o.id === selectedOrg);
        if (org) {
          onEventCreated(
            createDemoEvent(
              "seat",
              action === "add" ? "seats_added" : "seats_removed",
              org.name,
              org.id,
              `${action === "add" ? "+" : "-"}${quantity} ${seatType} seats`,
            ),
          );
        }
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to update seats",
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
          <Select
            value={seatType}
            onValueChange={(value) =>
              setSeatType(value as "admin" | "user" | "viewer")
            }
          >
            <SelectTrigger id="seat-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="seat-quantity">Quantity</Label>
          <Input
            id="seat-quantity"
            type="number"
            min="1"
            max="100"
            value={quantity}
            onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => handleSeatAction("add")}
          disabled={loading || !selectedOrg}
          className="flex-1"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Add Seats
        </Button>
        <Button
          onClick={() => handleSeatAction("remove")}
          disabled={loading || !selectedOrg}
          variant="outline"
          className="flex-1"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Minus className="h-4 w-4 mr-2" />
          )}
          Remove Seats
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
