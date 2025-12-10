import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UserDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-900 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashboard User</h1>
          <div className="flex items-center gap-4">
            <span>Halo, {user?.username}</span>
            <Button variant="outline" onClick={logout} className="text-blue-900 bg-white hover:bg-gray-100">
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        <Card>
          <CardHeader>
            <CardTitle>✅ Auth Berhasil!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Selamat datang di dashboard user.</p>
            <p className="text-sm text-gray-600 mt-2">
              Fitur peminjaman ruangan akan dibuat di Langkah 7.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}