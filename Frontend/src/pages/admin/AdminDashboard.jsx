import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-900 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">Dashboard Admin</h1>
            <Badge variant="secondary">ADMIN</Badge>
          </div>
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
            <CardTitle>✅ Admin Access Granted!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Selamat datang di dashboard admin.</p>
            <p className="text-sm text-gray-600 mt-2">
              Fitur CRUD ruangan & approve/reject akan dibuat di Langkah 8.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}