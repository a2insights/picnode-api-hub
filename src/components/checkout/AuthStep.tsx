import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { login as apiLogin, register as apiRegister } from '@/services/apiService';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AuthStepProps {
  onAuth: (user: { email: string; name: string }) => void;
}

export const AuthStep = ({ onAuth }: AuthStepProps) => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPasswordConfirmation, setSignupPasswordConfirmation] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [signupErrors, setSignupErrors] = useState<{ [key: string]: string[] }>({});
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    try {
      await apiLogin({ email: loginEmail, password: loginPassword });
      await login({ email: loginEmail, password: loginPassword });
      onAuth({ email: loginEmail, name: '' }); // Name is fetched in context
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        setLoginError(error.response.data.error);
      } else {
        console.error('Login failed:', error);
        setLoginError('An unexpected error occurred.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupErrors({});
    setSignupLoading(true);
    try {
      const user = {
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        password_confirmation: signupPasswordConfirmation,
      };
      await apiRegister(user);
      await login({ email: signupEmail, password: signupPassword });
      onAuth({ name: signupName, email: signupEmail });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.errors) {
        setSignupErrors(error.response.data.errors);
      } else {
        console.error('Signup failed:', error);
      }
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">{t('checkout.auth.login')}</TabsTrigger>
          <TabsTrigger value="signup">{t('checkout.auth.signup')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>{t('checkout.auth.loginTitle')}</CardTitle>
              <CardDescription>{t('checkout.auth.loginDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              {loginError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle>Login Failed</AlertTitle>
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">{t('checkout.auth.email')}</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">{t('checkout.auth.password')}</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loginLoading}>
                  {loginLoading ? t('checkout.auth.loading') : t('checkout.auth.loginButton')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signup">
          <Card>
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
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                  />
                  {signupErrors.name && <p className="text-red-500 text-sm mt-1">{signupErrors.name[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">{t('checkout.auth.email')}</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                  {signupErrors.email && <p className="text-red-500 text-sm mt-1">{signupErrors.email[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">{t('checkout.auth.password')}</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                  {signupErrors.password && <p className="text-red-500 text-sm mt-1">{signupErrors.password[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password-confirmation">Confirm Password</Label>
                  <Input
                    id="signup-password-confirmation"
                    type="password"
                    value={signupPasswordConfirmation}
                    onChange={(e) => setSignupPasswordConfirmation(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={signupLoading}>
                  {signupLoading ? t('checkout.auth.loading') : t('checkout.auth.signupButton')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
