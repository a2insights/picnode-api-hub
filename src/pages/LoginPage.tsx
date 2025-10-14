import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { login as apiLogin } from '@/services/apiService';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const LoginPage = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await apiLogin({ email, password });
      await login({ email, password });
      navigate('/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        console.error('Login failed:', error);
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('checkout.auth.loginTitle')}</CardTitle>
          <CardDescription>
            {t('checkout.auth.loginDescription')}. Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Login Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">{t('checkout.auth.email')}</Label>
              <Input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">{t('checkout.auth.password')}</Label>
              <Input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {t('checkout.auth.loginButton')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
