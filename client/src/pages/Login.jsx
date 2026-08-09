import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, ShieldCheck, UserCheck, AlertTriangle } from 'lucide-react';

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
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

    // Quick Demo Login Helper
    const handleDemoLogin = async (email) => {
        setError('');
        setLoading(true);
        try {
            await login(email, 'password123');
            navigate('/');
        } catch (err) {
            setError('Demo login failed. Please ensure your backend server and database are running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] bg-[#F5F1E8] text-[#24302B]">
            {/* Left Hero Sidebar */}
            <div className="bg-[#176B4D] text-[#FFFDF7] p-8 lg:p-14 flex flex-col justify-between min-h-[320px] lg:min-h-screen">
                <a href="/" className="flex items-center gap-3 text-[#FFFDF7] no-underline">
                    <span className="w-8 h-8 rounded-full bg-[#FFFDF7] text-[#176B4D] grid place-items-center font-bold text-lg -rotate-[30deg]">
                        ⌁
                    </span>
                    <div>
                        <b className="block text-base tracking-tight font-heading">Humanity First</b>
                        <small className="block font-mono text-[10px] tracking-widest text-[#B7D9C5] uppercase">
                            LEARNING HUB
                        </small>
                    </div>
                </a>

                <div className="my-auto py-8 max-w-[560px]">
                    <span className="font-mono text-xs tracking-widest text-[#B7D9C5] block mb-3 uppercase">
                        FIELD MANUAL / 2026
                    </span>
                    <h1 className="text-4xl lg:text-6xl font-heading font-bold leading-tight mb-4 tracking-tight">
                        Learn with purpose.<br />
                        <em className="not-italic text-[#F0C1A8]">Lead with care.</em>
                    </h1>
                    <p className="text-base lg:text-lg leading-relaxed text-[#CFE4D5] max-w-[420px] mb-8">
                        A practical learning space for the people who make community action possible.
                    </p>
                    <div className="h-px bg-[#6CAA8A] w-24 my-6"></div>
                    <span className="font-mono text-xs tracking-widest text-[#B7D9C5] uppercase">
                        HUMANITY FIRST NGO
                    </span>
                </div>
            </div>

            {/* Right Form Panel */}
            <section className="grid place-items-center p-6 lg:p-12 bg-[#F5F1E8]">
                <div className="max-w-[400px] w-full">
                    <span className="font-mono text-xs tracking-widest text-[#5C665F] uppercase block mb-1">
                        {isRegister ? 'JOIN THE NETWORK' : 'WELCOME BACK'}
                    </span>
                    <h2 className="text-3xl font-heading font-bold mb-2">
                        {isRegister ? 'Begin your orientation.' : 'Continue your learning.'}
                    </h2>
                    <p className="text-[#5C665F] text-sm mb-6">
                        {isRegister
                            ? 'Create an account for staff and volunteers.'
                            : 'Your next useful step is waiting.'}
                    </p>

                    {/* Session Expired Warning Banner */}
                    {isSessionExpired && !error && (
                        <div className="bg-[#FFF3CD] text-[#856404] p-3.5 text-xs font-semibold rounded-xl mb-4 border border-[#FFEEBA] flex items-center gap-2 shadow-xs">
                            <AlertTriangle className="w-4 h-4 text-[#856404] shrink-0" />
                            <span>Your 3-hour session expired. Please log in to continue.</span>
                        </div>
                    )}

                    {error && (
                        <div className="bg-[#F5D8D5] text-[#A94442] p-3 text-sm rounded mb-4 border border-[#E8B4B0]">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid gap-4">
                        {isRegister && (
                            <div>
                                <label className="block text-xs font-semibold mb-1">Full name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="Your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-[#FFFDF7] border border-[#D4CEC0] rounded text-sm outline-none focus:border-[#176B4D]"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold mb-1">Email address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="you@example.org"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 bg-[#FFFDF7] border border-[#D4CEC0] rounded text-sm outline-none focus:border-[#176B4D]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                required
                                placeholder="8 characters minimum (with a number or symbol)"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-3 bg-[#FFFDF7] border border-[#D4CEC0] rounded text-sm outline-none focus:border-[#176B4D]"
                            />
                        </div>

                        {isRegister && (
                            <div>
                                <label className="block text-xs font-semibold mb-1">Joining as</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-[#FFFDF7] border border-[#D4CEC0] rounded text-sm outline-none focus:border-[#176B4D]"
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
                            className="w-full mt-2 bg-[#176B4D] hover:bg-[#C96B3C] text-[#FFFDF7] font-semibold p-3.5 rounded flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                        >
                            {loading
                                ? 'Processing...'
                                : isRegister
                                    ? 'Create account'
                                    : 'Log in'}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <button
                        type="button"
                        onClick={() => {
                            setIsRegister(!isRegister);
                            setError('');
                        }}
                        className="text-[#176B4D] text-xs font-semibold border-0 bg-transparent cursor-pointer my-5 mx-auto block hover:underline"
                    >
                        {isRegister
                            ? 'Already have an account? Log in'
                            : 'New to Humanity First? Create an account'}
                    </button>

                    {/* Discreet Demo Login Shortcuts */}
                    <div className="mt-2 pt-4 border-t border-[#D4CEC0] text-center">
                        <span className="font-mono text-[10px] text-[#5C665F] uppercase block mb-2">
                            Quick Demo Login
                        </span>
                        <div className="flex justify-center gap-2 flex-wrap">
                            <button
                                type="button"
                                onClick={() => handleDemoLogin('volunteer@humanityfirst.org')}
                                className="text-xs bg-[#D8E8DD] text-[#176B4D] px-2.5 py-1 rounded font-medium border-0 cursor-pointer hover:bg-[#176B4D] hover:text-[#FFFDF7] transition-all flex items-center gap-1"
                            >
                                <UserCheck className="w-3 h-3" /> Volunteer
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDemoLogin('shyamphad03@gmail.com')}
                                className="text-xs bg-[#E9E4D8] text-[#24302B] px-2.5 py-1 rounded font-medium border-0 cursor-pointer hover:bg-[#176B4D] hover:text-[#FFFDF7] transition-all flex items-center gap-1"
                            >
                                <UserCheck className="w-3 h-3" /> Trainer
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDemoLogin('admin@humanityfirst.org')}
                                className="text-xs bg-[#F0D4C3] text-[#C96B3C] px-2.5 py-1 rounded font-medium border-0 cursor-pointer hover:bg-[#C96B3C] hover:text-[#FFFDF7] transition-all flex items-center gap-1"
                            >
                                <UserCheck className="w-3 h-3" /> Admin
                            </button>
                        </div>
                    </div>

                    <p className="border-t border-[#D4CEC0] pt-4 mt-4 text-[#5C665F] text-xs flex items-center justify-center gap-1.5 text-center">
                        <ShieldCheck className="w-4 h-4 text-[#176B4D]" />
                        Your learning data is kept private and secure.
                    </p>
                </div>
            </section>
        </main>
    );
};

export default Login;
