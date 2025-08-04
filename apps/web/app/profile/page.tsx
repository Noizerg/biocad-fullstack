import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  console.log("accessToken", accessToken);
  if (!accessToken) {
    redirect("/");
  }

  const res = await fetch("http://localhost:5000/users/me", {
    headers: { Authorization: `Bearer ${accessToken}` },

    cache: "no-store",
  });
  if (!res.ok) {
    redirect("/");
  }
  const user = await res.json();

  return (
    <div className="max-w-lg mx-auto p-8">
      <h1 className="text-2xl mb-6">👤 Профиль</h1>
      <div className="bg-muted rounded p-4">
        <div>
          <b>Email:</b> {user.email}
        </div>
        <div>
          <b>ID:</b> {user.id}
        </div>
        <div>
          <b>Создан:</b> {new Date(user.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
