import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SideNavProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    href: string
    title: string
    icon?: React.ReactNode
  }[]
}

export function SideNav({ className, items, ...props }: SideNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === item.href ? "bg-accent" : "transparent"
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  )
}