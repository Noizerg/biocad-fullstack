// apps/web/app/users/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function UsersPage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value

  if (!accessToken) {
    redirect('/')
  }

  const res = await fetch('http://localhost:5000/users', {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  })
  if (!res.ok) {
    redirect('/')
  }
  const users = await res.json()

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl mb-6">Пользователи</h1>
      <ul className="divide-y">
        {users.map((user: any) => (
          <li key={user.id} className="py-3 flex flex-col">
            <b>{user.email}</b>
            <span className="text-muted-foreground text-xs">{user.id}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
