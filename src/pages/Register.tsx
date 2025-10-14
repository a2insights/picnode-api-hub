import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { register } from '@/services/apiService';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
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
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
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
            <Button type="submit" className="w-full">
              {t('checkout.auth.signupButton')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
