


import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { ArrowRightIcon, UserCircleIcon, UsersIcon } from './icons';
import { Page, ListingType } from '../types';
import { Button } from './Button';

interface AuthPageProps {
  onNavigate: (page: Page | 'login', listingType?: ListingType) => void;
}

type AuthView = 'signin' | 'signup' | 'forgot_password';
type UserRole = 'user' | 'agent';

export const AuthPage: React.FC<AuthPageProps> = ({ onNavigate }) => {
    const [view, setView] = useState<AuthView>('signin');
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>('user');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const resetState = () => {
        setFullName('');
        setEmail('');
        setPassword('');
        setError(null);
        setMessage(null);
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (view === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            role: role,
                        }
                    }
                });
                if (error) throw error;
                setMessage('Success! Check your email for a confirmation link.');
            } else { // signin
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                onNavigate('listings');
            }
        } catch (err: any) {
            setError(err.error_description || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin, // URL to redirect to after password reset
            });
            if (error) throw error;
            setMessage('Password reset link sent! Please check your email.');
        } catch (err: any) {
             setError(err.error_description || err.message);
        } finally {
            setLoading(false);
        }
    };
    
    const inputStyles = "w-full bg-white/5 border border-white/20 placeholder-slate-400 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400/70 transition-all duration-300 shadow-lg shadow-black/10";

    const renderMainForm = () => (
        <form onSubmit={handleAuth} className="space-y-6">
            {view === 'signup' && (
                <>
                    <div>
                        <label htmlFor="full-name" className="sr-only">Full Name</label>
                        <input id="full-name" name="full-name" type="text" autoComplete="name" required value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputStyles} placeholder="Full Name" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">I am signing up as a...</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button type="button" onClick={() => setRole('user')} className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-colors ${role === 'user' ? 'bg-violet-500/30 border-violet-400 text-white' : 'bg-white/5 border-white/20 text-slate-300 hover:bg-white/10'}`}>
                                <UserCircleIcon className="w-5 h-5" />
                                <span className="font-semibold">User</span>
                            </button>
                             <button type="button" onClick={() => setRole('agent')} className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-colors ${role === 'agent' ? 'bg-violet-500/30 border-violet-400 text-white' : 'bg-white/5 border-white/20 text-slate-300 hover:bg-white/10'}`}>
                                <UsersIcon className="w-5 h-5" />
                                <span className="font-semibold">Agent</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
            <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input id="email-address" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputStyles} placeholder="Email address" />
            </div>
            <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input id="password" name="password" type="password" autoComplete={view === 'signup' ? "new-password" : "current-password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className={inputStyles} placeholder="Password" />
            </div>

            {view === 'signin' && (
                 <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-slate-500 text-violet-600 bg-white/10 focus:ring-violet-500" />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300">Remember me</label>
                    </div>

                    <div className="text-sm">
                        <button type="button" onClick={() => { setView('forgot_password'); resetState(); }} className="font-medium text-violet-400 hover:text-violet-300">Forgot your password?</button>
                    </div>
                </div>
            )}
            
            <div>
                <Button type="submit" disabled={loading} className="w-full">
                    <span>{loading ? 'Processing...' : (view === 'signup' ? 'Create Account' : 'Sign In')}</span>
                    {!loading && <ArrowRightIcon className="w-5 h-5" />}
                </Button>
            </div>
        </form>
    );

    const renderForgotPasswordForm = () => (
        <form onSubmit={handlePasswordReset} className="space-y-6">
            <div>
                 <label htmlFor="email-address" className="sr-only">Email address</label>
                <input id="email-address" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputStyles} placeholder="Enter your email address" />
            </div>
             <div>
                <Button type="submit" disabled={loading} className="w-full">
                    <span>{loading ? 'Sending...' : 'Send Reset Link'}</span>
                    {!loading && <ArrowRightIcon className="w-5 h-5" />}
                </Button>
            </div>
        </form>
    );

    return (
        <div 
            className="w-full flex flex-col justify-center items-center p-4 bg-cover bg-center animate-fade-in py-24 md:py-32"
            style={{ backgroundImage: "url('https://strg21.dozendreams.com/storage/v1/object/public/assetspublic//Dozendreams%20Login%20Hero.webp')" }}
        >
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative w-full max-w-md space-y-8">
                <div>
                   <h1 className="text-4xl font-bold text-white tracking-tight text-center drop-shadow-lg">
                       {view === 'forgot_password' ? 'Reset Your Password' : 'Manifest Your Dreams.'}
                   </h1>
                   <p className="mt-4 text-slate-300 text-center">
                       {view === 'signin' && `Don't have an account? `}
                       {view === 'signup' && `Already have an account? `}
                       {view === 'forgot_password' && `Remembered your password? `}
                       <button onClick={() => { 
                           setView(view === 'signin' ? 'signup' : 'signin'); 
                           resetState();
                       }} className="font-medium text-violet-400 hover:text-violet-300 transition-colors">
                           {view === 'signin' && 'Create one'}
                           {view === 'signup' && 'Sign In'}
                           {view === 'forgot_password' && 'Sign In'}
                       </button>
                   </p>
                </div>
               
                <div className="bg-black/30 backdrop-blur-2xl p-8 rounded-2xl shadow-2xl shadow-black/20 border border-white/10">
                    {view === 'forgot_password' ? renderForgotPasswordForm() : renderMainForm()}
                </div>

                {error && <p className="text-center text-sm text-red-400 bg-red-900/50 py-2 px-4 rounded-lg animate-fade-in">{error}</p>}
                {message && <p className="text-center text-sm text-green-300 bg-green-900/50 py-2 px-4 rounded-lg animate-fade-in">{message}</p>}

                {view !== 'forgot_password' && (
                    <div className="text-center">
                       <p className="text-xs text-slate-400">
                           By {view === 'signup' ? 'creating an account' : 'signing in'}, you agree to our<br/>
                           <a href="#" className="underline hover:text-white">Terms of Service</a> & <a href="#" className="underline hover:text-white">Privacy Policy</a>.
                       </p>
                    </div>
                )}
            </div>
        </div>
    );
};