import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { updateProfile, sendConfirmationEmail } from '@/services/apiService';
import axios from 'axios';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [emailSentMessage, setEmailSentMessage] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');
    try {
      const updatedUser = { name, email, password, password_confirmation: passwordConfirmation };
      await updateProfile(updatedUser);
      login({ name, email });
      setSuccessMessage('Profile updated successfully!');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error('Profile update failed:', error);
      }
    }
  };

  const handleConfirmEmail = async () => {
    setEmailSentMessage('');
    try {
      await sendConfirmationEmail();
      setEmailSentMessage('A new confirmation email has been sent.');
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
    }
  };

  return (
    <div>
      {successMessage && (
        <Alert className="mb-4">
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-confirmation">Confirm New Password</Label>
              <Input
                id="password-confirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
            </div>
            <Button type="submit">Update Profile</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Confirmation</CardTitle>
          <CardDescription>Confirm your email address to ensure account security.</CardDescription>
        </CardHeader>
        <CardContent>
          {emailSentMessage && (
            <Alert className="mb-4">
              <AlertTitle>Email Sent!</AlertTitle>
              <AlertDescription>{emailSentMessage}</AlertDescription>
            </Alert>
          )}
          {user?.email_verified_at ? (
            <p>Your email has been confirmed.</p>
          ) : (
            <div className="flex items-center justify-between">
              <p>Your email is not confirmed.</p>
              <Button onClick={handleConfirmEmail}>Send Confirmation Email</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
