"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import type { DemoEvent } from "../lib/demo-utils";

interface EventLogProps {
  events: DemoEvent[];
}

const EVENT_TYPE_COLORS = {
  customer: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  seat: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
  usage: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
};

export function EventLog({ events }: EventLogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Event Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground text-center py-8">
            No events yet. Start by creating some customers!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Log ({events.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 text-sm"
            >
              <Badge
                className={EVENT_TYPE_COLORS[event.type]}
                variant="secondary"
              >
                {event.type}
              </Badge>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium truncate">{event.orgName}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-muted-foreground">{event.details}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
