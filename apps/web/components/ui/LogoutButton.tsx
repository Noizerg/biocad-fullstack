'use client';

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch('http://localhost:5000/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    window.location.href = '/';
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
    >
      Logout
    </button>
  );
}
