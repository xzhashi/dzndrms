import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { ArrowRightIcon } from './icons';
import { Page } from '../types';

interface AuthPageProps {
  onNavigate: (page: Page | 'login') => void;
}

const AuthImage = () => (
    <div
        className="hidden lg:block lg:col-span-1 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1589241066343-809333854b7e?q=80&w=1974&auto=format&fit=crop')" }}
    >
        <div className="w-full h-full bg-black/30"></div>
    </div>
);

export const AuthPage: React.FC<AuthPageProps> = ({ onNavigate }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ 
                    email, 
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        }
                    }
                });
                if (error) throw error;
                setMessage('Success! Check your email for a confirmation link.');
            } else {
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
    
    const inputStyles = "w-full bg-white/70 backdrop-blur-lg placeholder-slate-500 text-slate-900 px-4 py-3 rounded-xl border border-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500/70 transition-all duration-300 shadow-lg shadow-violet-500/5";

    return (
        <div className="lg:grid lg:grid-cols-2 animate-fade-in">
            <AuthImage />
            <div className="flex flex-col justify-center items-center p-4 py-16 lg:p-12 bg-gradient-to-br from-slate-50 via-violet-50 to-purple-50">
               <div className="w-full max-w-md space-y-8">
                   <div>
                       <h1 className="text-4xl font-extrabold text-slate-800 leading-tight tracking-tight text-center lg:text-left">
                           Manifest Your Dreams.
                       </h1>
                       <p className="mt-4 text-slate-600 text-center lg:text-left">
                           {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                           <button onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null)}} className="font-semibold text-violet-600 hover:text-violet-500 transition-colors">
                               {isSignUp ? 'Sign In' : 'Create one'}
                           </button>
                       </p>
                   </div>
                   
                   <div className="bg-white/50 backdrop-blur-2xl p-8 rounded-2xl shadow-2xl shadow-violet-500/10 border border-white/60">
                        <form onSubmit={handleAuth} className="space-y-6">
                           {isSignUp && (
                               <div>
                                   <label htmlFor="full-name" className="sr-only">Full Name</label>
                                   <input
                                       id="full-name"
                                       name="full-name"
                                       type="text"
                                       autoComplete="name"
                                       required
                                       value={fullName}
                                       onChange={(e) => setFullName(e.target.value)}
                                       className={inputStyles}
                                       placeholder="Full Name"
                                   />
                               </div>
                           )}
                           <div>
                               <label htmlFor="email-address" className="sr-only">Email address</label>
                               <input
                                   id="email-address"
                                   name="email"
                                   type="email"
                                   autoComplete="email"
                                   required
                                   value={email}
                                   onChange={(e) => setEmail(e.target.value)}
                                   className={inputStyles}
                                   placeholder="Email address"
                               />
                           </div>
                           <div>
                               <label htmlFor="password" className="sr-only">Password</label>
                               <input
                                   id="password"
                                   name="password"
                                   type="password"
                                   autoComplete={isSignUp ? "new-password" : "current-password"}
                                   required
                                   minLength={6}
                                   value={password}
                                   onChange={(e) => setPassword(e.target.value)}
                                   className={inputStyles}
                                   placeholder="Password"
                               />
                           </div>
                           
                           <div>
                               <button
                                   type="submit"
                                   disabled={loading}
                                   className="group relative w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:shadow-lg hover:shadow-violet-400/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-violet-500 disabled:opacity-50 disabled:cursor-wait transition-all"
                               >
                                   {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                                   {!loading && <ArrowRightIcon className="w-5 h-5 ml-auto text-violet-300 group-hover:text-white transition-colors" />}
                               </button>
                           </div>
                       </form>
                    </div>

                    {error && <p className="text-center text-sm text-red-600 animate-fade-in">{error}</p>}
                    {message && <p className="text-center text-sm text-green-600 animate-fade-in">{message}</p>}

                   <div className="text-center">
                       <p className="text-xs text-slate-500">
                           By {isSignUp ? 'creating an account' : 'signing in'}, you agree to our<br/>
                           <a href="#" className="underline hover:text-slate-800">Terms of Service</a> & <a href="#" className="underline hover:text-slate-800">Privacy Policy</a>.
                       </p>
                   </div>
               </div>
            </div>
        </div>
    );
};
