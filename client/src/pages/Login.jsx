import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, AlertTriangle, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'volunteer'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const isSessionExpired = searchParams.get('sessionExpired') === 'true';

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isRegister) {
                await register(formData.name, formData.email, formData.password, formData.role);
            } else {
                await login(formData.email, formData.password);
            }
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_1fr] bg-[#F9F8F3] text-[#24302B]">
            {/* Left Hero Sidebar */}
            <div className="bg-gradient-to-br from-[#0F4C3A] via-[#145B45] to-[#196B52] text-[#FFFDF7] p-8 lg:p-16 flex flex-col justify-between min-h-[360px] lg:min-h-screen relative overflow-hidden">
                {/* Embedded SVG Brand Logo & Header */}
                <a href="/" className="flex items-center gap-3.5 text-[#FFFDF7] no-underline z-10">
                    <div className="w-10 h-10 rounded-xl bg-[#14583E] border border-[#F0C1A8]/30 flex items-center justify-center shadow-inner shrink-0">
                        <svg className="w-6 h-6 text-[#F0C1A8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <div>
                        <b className="block text-lg font-bold tracking-tight font-heading leading-none">Humanity First</b>
                        <small className="block font-mono text-[10px] tracking-widest text-[#B7D9C5] uppercase mt-1">
                            LEARNING PLATFORM
                        </small>
                    </div>
                </a>

                {/* Hero Message */}
                <div className="my-auto py-10 max-w-[500px] z-10">
                    <h1 className="text-3xl lg:text-5xl font-heading font-extrabold leading-tight mb-5 tracking-tight text-[#FFFDF7]">
                        Empowering Communities Through Purposeful Learning.
                    </h1>
                    <p className="text-base lg:text-lg leading-relaxed text-[#CFE4D5] font-sans">
                        Access training modules, track field progress, and collaborate with team members.
                    </p>
                </div>

                {/* Subtle Background Decorative Blur */}
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#176B4D] rounded-full filter blur-3xl opacity-50 pointer-events-none"></div>
            </div>

            {/* Right Form Panel */}
            <section className="grid place-items-center p-6 lg:p-14 bg-[#F9F8F3]">
                <div className="max-w-[420px] w-full bg-[#FFFDF7] p-8 lg:p-10 rounded-2xl border border-[#D4CEC0] shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-2xl lg:text-3xl font-heading font-extrabold text-[#24302B] tracking-tight">
                            {isRegister ? 'Create an account' : 'Welcome Back'}
                        </h2>
                        <p className="text-[#5C665F] text-xs lg:text-sm mt-1.5 font-sans">
                            {isRegister
                                ? 'Join Humanity First Learning Hub'
                                : 'Sign in to your account to continue'}
                        </p>
                    </div>

                    {/* Session Expired Warning Banner */}
                    {isSessionExpired && !error && (
                        <div className="bg-[#FFF8E6] text-[#8C6B1B] p-3.5 text-xs font-semibold rounded-xl mb-5 border border-[#F5E6BF] flex items-center gap-2.5 shadow-xs">
                            <AlertTriangle className="w-4 h-4 text-[#8C6B1B] shrink-0" />
                            <span>Your 3-hour session expired. Please log in again to continue.</span>
                        </div>
                    )}

                    {error && (
                        <div className="bg-[#FDF2F2] text-[#9B1C1C] p-3.5 text-xs font-semibold rounded-xl mb-5 border border-[#FDE8E8]">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                        {isRegister && (
                            <div>
                                <label className="block text-xs font-semibold text-[#24302B] mb-1.5">Full name</label>
                                <div className="relative">
                                    <User className="w-4 h-4 text-[#8C9690] absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3.5 py-3 bg-[#FFFDF7] border border-[#D4CEC0] rounded-xl text-sm outline-none focus:border-[#176B4D] focus:ring-1 focus:ring-[#176B4D] transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-[#24302B] mb-1.5">Email address</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-[#8C9690] absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="you@example.org"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-3.5 py-3 bg-[#FFFDF7] border border-[#D4CEC0] rounded-xl text-sm outline-none focus:border-[#176B4D] focus:ring-1 focus:ring-[#176B4D] transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#24302B] mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-[#8C9690] absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    required
                                    placeholder="Minimum 8 characters"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-10 py-3 bg-[#FFFDF7] border border-[#D4CEC0] rounded-xl text-sm outline-none focus:border-[#176B4D] focus:ring-1 focus:ring-[#176B4D] transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C9690] hover:text-[#24302B] border-0 bg-transparent cursor-pointer p-0.5"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {isRegister && (
                            <div>
                                <label className="block text-xs font-semibold text-[#24302B] mb-1.5">Joining as</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-[#FFFDF7] border border-[#D4CEC0] rounded-xl text-sm outline-none focus:border-[#176B4D] focus:ring-1 focus:ring-[#176B4D] cursor-pointer transition-all"
                                >
                                    <option value="volunteer">Volunteer</option>
                                    <option value="field_worker">Field Worker</option>
                                    <option value="trainer">Trainer</option>
                                </select>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-3 bg-[#176B4D] hover:bg-[#14583E] text-[#FFFDF7] font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#176B4D]/15 disabled:opacity-50 text-sm"
                        >
                            {loading
                                ? 'Processing...'
                                : isRegister
                                    ? 'Create account'
                                    : 'Log In'}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-[#D4CEC0]/60 text-center">
                        <button
                            type="button"
                            onClick={() => {
                                setIsRegister(!isRegister);
                                setError('');
                            }}
                            className="text-[#176B4D] hover:text-[#14583E] text-xs font-semibold border-0 bg-transparent cursor-pointer hover:underline transition-all"
                        >
                            {isRegister
                                ? 'Already have an account? Log in'
                                : "Don't have an account? Sign up"}
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Login;
