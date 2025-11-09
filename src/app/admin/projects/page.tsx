import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import prisma from "@/lib/db"
import { Eye, Pencil, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

async function getProjects() {
  return await prisma.project.findMany({
    orderBy: {
      updatedAt: "desc"
    }
  })
}

export default async function ProjectsPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/admin/login")
  }

  const projects = await getProjects()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">
            Manage your portfolio projects
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </Link>
      </div>

      <Card>
        <div className="p-6">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b">
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Title
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Status
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Created
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Updated
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b">
                    <td className="p-4 align-middle">{project.titleEn}</td>
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        project.status === "PUBLISHED" 
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 align-middle">
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/projects/${project.id}`}
                          target="_blank"
                          className="rounded-md p-2 hover:bg-muted"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className="rounded-md p-2 hover:bg-muted"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          className="rounded-md p-2 hover:bg-muted"
                          onClick={() => {
                            // TODO: Implement delete functionality
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No projects found
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