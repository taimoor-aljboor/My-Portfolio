import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import prisma from "@/lib/db"

async function getProfile() {
  return await prisma.profile.findFirst()
}

export default async function ProfilePage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/admin/login")
  }

  const profile = await getProfile()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">
          Manage your personal and professional information
        </p>
      </div>

      <Card>
        <div className="p-6">
          <form className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="fullNameEn">
                  Full Name (English)
                </label>
                <input
                  id="fullNameEn"
                  name="fullNameEn"
                  defaultValue={profile?.fullNameEn}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="fullNameAr">
                  Full Name (Arabic)
                </label>
                <input
                  id="fullNameAr"
                  name="fullNameAr"
                  defaultValue={profile?.fullNameAr}
                  dir="rtl"
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="headlineEn">
                  Headline (English)
                </label>
                <input
                  id="headlineEn"
                  name="headlineEn"
                  defaultValue={profile?.headlineEn}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="headlineAr">
                  Headline (Arabic)
                </label>
                <input
                  id="headlineAr"
                  name="headlineAr"
                  defaultValue={profile?.headlineAr}
                  dir="rtl"
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium" htmlFor="bioEn">
                  Bio (English)
                </label>
                <textarea
                  id="bioEn"
                  name="bioEn"
                  defaultValue={profile?.bioEn}
                  rows={5}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium" htmlFor="bioAr">
                  Bio (Arabic)
                </label>
                <textarea
                  id="bioAr"
                  name="bioAr"
                  defaultValue={profile?.bioAr}
                  dir="rtl"
                  rows={5}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={profile?.email}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="phone">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={profile?.phone || ""}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="locationEn">
                  Location (English)
                </label>
                <input
                  id="locationEn"
                  name="locationEn"
                  defaultValue={profile?.locationEn}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="locationAr">
                  Location (Arabic)
                </label>
                <input
                  id="locationAr"
                  name="locationAr"
                  defaultValue={profile?.locationAr}
                  dir="rtl"
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}