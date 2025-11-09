import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Archive, Mail, Trash2 } from "lucide-react"

// Temporary type until database is fixed
type Message = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: "NEW" | "READ" | "ARCHIVED"
  createdAt: Date
  updatedAt: Date
}

async function getMessages(): Promise<Message[]> {
  // Temporary empty array until database is fixed
  return []
}

export default async function MessagesPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/admin/login")
  }

  const messages = await getMessages()

  if (messages.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Messages</h2>
          <p className="text-muted-foreground">
            View and manage messages from your contact form
          </p>
        </div>

        <Card>
          <div className="p-6">
            <div className="text-center py-12">
              <Mail className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No Messages Yet</h3>
              <p className="mt-2 text-muted-foreground">
                Messages from your contact form will appear here
              </p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Messages</h2>
        <p className="text-muted-foreground">
          View and manage messages from your contact form
        </p>
      </div>

      <Card>
        <div className="p-6">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b">
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Name
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Email
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Subject
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Status
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Date
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message) => (
                  <tr key={message.id} className="border-b">
                    <td className="p-4 align-middle">{message.name}</td>
                    <td className="p-4 align-middle">{message.email}</td>
                    <td className="p-4 align-middle">{message.subject}</td>
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        message.status === "NEW"
                          ? "bg-blue-100 text-blue-700"
                          : message.status === "READ"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {message.status}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        <button
                          className="rounded-md p-2 hover:bg-muted"
                          title="Mark as read"
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                        <button
                          className="rounded-md p-2 hover:bg-muted"
                          title="Archive"
                        >
                          <Archive className="h-4 w-4" />
                        </button>
                        <button
                          className="rounded-md p-2 hover:bg-muted"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {messages.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No messages found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  )
}