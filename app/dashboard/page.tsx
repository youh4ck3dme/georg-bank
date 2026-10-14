import { redirect } from 'next/navigation'

/**
 * Legacy /dashboard shell — permanently redirected to /dashboard3.
 * Keep the route so old bookmarks / menu links still resolve.
 */
export default function DashboardPage() {
  redirect('/dashboard3')
}
