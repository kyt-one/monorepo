import { Button } from "@repo/ui";
import { signOut } from "./actions";

export default function DashboardPage() {
  return (
    <main className="min-h-screen p-8 flex flex-col items-center justify-center gap-4">
      <h1>Template</h1>
      <form action={signOut}>
        <Button variant="destructive">Sign Out</Button>
      </form>
    </main>
  );
}
