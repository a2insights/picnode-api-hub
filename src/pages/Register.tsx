import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { register } from '@/services/apiService';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const user = { name, email, password, password_confirmation: passwordConfirmation };
      await register(user);
      login({ name, email });
      navigate('/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error('Signup failed:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen py-12">
      <Link to="/" className="mb-8 flex flex-col items-center gap-2 group">
        <div className="p-2 rounded-2xl bg-primary/5 group-hover:scale-105 transition-transform duration-300">
          <img src="/favicon.png" alt="PicNode Logo" className="h-16 w-16 object-contain" />
        </div>
        <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          PicNode
        </span>
      </Link>
      <Card className="w-full max-w-md shadow-xl border-primary/10">
        <CardHeader>
          <CardTitle>{t('checkout.auth.signupTitle')}</CardTitle>
          <CardDescription>{t('checkout.auth.signupDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-name">{t('checkout.auth.name')}</Label>
              <Input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">{t('checkout.auth.email')}</Label>
              <Input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">{t('checkout.auth.password')}</Label>
              <Input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password-confirmation">Confirm Password</Label>
              <Input
                id="signup-password-confirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loading...' : t('checkout.auth.signupButton')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
