import { getDemoOrganizations } from "@/modules/dashboard/lib/get-demo-organizations";
import { CreateCustomersForm } from "@/modules/dashboard/components/create-customers-form";
import { SeatEventsForm } from "@/modules/dashboard/components/seat-events-form";
import { UsageEventsForm } from "@/modules/dashboard/components/usage-events-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import Link from "next/link";

export default async function DashboardPage() {
  const { organizations } = await getDemoOrganizations();

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">Billing Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage customers, seats, and usage events for your organization
          </p>
        </div>
        <Link
          href="https://docs.commet.co/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline text-lg font-medium"
        >
          Docs
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Demo Customers</CardTitle>
            <CardDescription>
              Create demo customers to test the billing system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateCustomersForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seat Events</CardTitle>
            <CardDescription>
              Track seat-based billing events (add/remove users)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SeatEventsForm organizations={organizations} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage Events</CardTitle>
            <CardDescription>
              Track usage-based billing events (API calls, storage, etc.)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UsageEventsForm organizations={organizations} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
