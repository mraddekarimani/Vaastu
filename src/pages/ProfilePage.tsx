import { useState, useEffect } from 'react';
import { User, Mail, Key, Save, Check, UserCircle } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      
      try {
        // First, try to get existing profile
        let { data: existingProfile, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError;
        }

        // If no profile exists, create one
        if (!existingProfile) {
          const { data: newProfile, error: insertError } = await supabase
            .from('users')
            .insert([
              {
                id: user.id,
                email: user.email,
                full_name: user.user_metadata?.full_name || null,
              },
            ])
            .select()
            .single();

          if (insertError) throw insertError;
          existingProfile = newProfile;
        }

        setProfile(existingProfile);
        setEmail(existingProfile.email || user.email || '');
        setFullName(existingProfile.full_name || '');
      } catch (error: any) {
        console.error('Error loading profile:', error);
        setError('Failed to load profile information');
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!user || !profile) return;
    
    setIsUpdating(true);
    
    try {
      // Update profile in users table
      const { error: profileError } = await supabase
        .from('users')
        .update({
          email,
          full_name: fullName || null,
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update auth user if email changed
      if (email !== user.email) {
        const { error: authError } = await supabase.auth.updateUser({ 
          email,
          data: { full_name: fullName }
        });
        if (authError) throw authError;
      }
      
      // Update password if provided
      if (password) {
        const { error: passwordError } = await supabase.auth.updateUser({ 
          password,
          data: { full_name: fullName }
        });
        if (passwordError) throw passwordError;
      }

      // Update local state
      setProfile({
        ...profile,
        email,
        full_name: fullName || null,
        updated_at: new Date().toISOString()
      });
      
      setSuccess('Profile updated successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Profile update error:', error);
      setError(error.message || 'An error occurred while updating your profile');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50 py-8">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6">Your Profile</h1>
          
          <div className="card p-6 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <UserCircle className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold">
                  {fullName || profile?.full_name || user?.email?.split('@')[0] || 'User'}
                </h2>
                <p className="text-gray-600">{email || user?.email}</p>
                {profile?.created_at && (
                  <p className="text-sm text-gray-500">
                    Member since {new Date(profile.created_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            
            {error && (
              <div className="mb-6 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}
            
            {success && (
              <div className="mb-6 rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">{success}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleUpdateProfile}>
              <div className="mb-4">
                <label htmlFor="fullName" className="form-label">Full Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    className="form-input pl-10"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="form-label">Email Address</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    className="form-input pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Changing your email will require verification
                </p>
              </div>
              
              <div className="border-t pt-6 mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">New Password</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      className="form-input pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Leave blank to keep current password"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="confirm-password" className="form-label">Confirm New Password</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirm-password"
                      type="password"
                      className="form-input pl-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                    />
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isUpdating}
                className="btn btn-primary"
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </form>
          </div>
          
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Subscription Details</h2>
            <div className="bg-primary-50 border border-primary-200 rounded-md p-4 mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-primary-800">Free Plan</h3>
                  <p className="text-primary-600">
                    You're currently on the free plan
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h3 className="text-lg font-medium">Plan Features</h3>
              </div>
              <div className="p-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Unlimited floor plan generation</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Advanced AI design features</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Save and manage floor plans</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>PNG export and download</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Detailed room specifications</span>
                  </li>
                  <li className="flex items-center text-gray-400">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>3D visualization (Premium only)</span>
                  </li>
                  <li className="flex items-center text-gray-400">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>CAD file export (Premium only)</span>
                  </li>
                </ul>
                
                <div className="mt-6">
                  <a href="#" className="btn btn-primary w-full">
                    Upgrade to Premium
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}