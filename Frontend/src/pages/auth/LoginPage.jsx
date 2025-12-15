import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {login} = useAuth();
  const navigate = useNavigate();
  
  const handleSummit = async (e) => {
      e.preventDefault();
      setError('');
      setLoading(true);

      try {
        const response = await fetch('http://localhost:3050/api/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email,password})
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login Gagal');
        }
        // Simpan data user dan token ke localStorages
        login(data.data.user, data.data.token);

        // Menentukan halaman berdasarkan role
        if (data.data.user.role === 'ADMIN') {
            navigate('/admin');
        } else {
            navigate('/dashboard');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
};
  
  return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 p-4">
        <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-4xl font-extrabold text-center text-blue-900">
            SiPinKa
          </CardTitle>
          <CardTitle className="text-2xl font-semibold text-center text-blue-900">
            Login
          </CardTitle>
          <CardDescription className="text-center">
            Masukkan email dan password untuk melanjutkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSummit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="nama@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-900 hover:bg-blue-800"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Login'}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Belum punya akun?{' '}
              <Link to="/register" className="text-blue-900 hover:underline font-medium">
                Daftar di sini
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
    )
};