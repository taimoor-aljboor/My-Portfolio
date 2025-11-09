import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function AdminDashboard() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/admin/login")
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid gap-6">
        <div className="p-6 bg-card rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Welcome, {session.user.email}</h2>
          <p className="text-muted-foreground">
            You are logged in as an administrator.
          </p>
        </div>
      </div>
    </div>
  )
}