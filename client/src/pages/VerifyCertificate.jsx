import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, GraduationCap, CheckCircle2, XCircle, ArrowLeft, Calendar, User, Award } from 'lucide-react';
import api from '../services/api';
import Badge from '../components/common/Badge';

const VerifyCertificate = () => {
  const { certId } = useParams();
  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyCert = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/certificates/verify/${certId}`);
        
        if (res.data && res.data.valid) {
          setValid(true);
          setCertData(res.data.data);
        } else {
          setValid(false);
          setError(res.data?.message || 'Invalid or revoked certificate ID.');
        }
      } catch (err) {
        setValid(false);
        setError(err.response?.data?.message || 'Certificate verification query failed. Invalid ID.');
      } finally {
        setLoading(false);
      }
    };

    if (certId) {
      verifyCert();
    }
  }, [certId]);

  return (
    <div className="min-h-screen bg-bg-warm text-ink p-6 md:p-12 font-sans flex flex-col justify-between items-center">
      {/* Top Header Logo */}
      <header className="w-full max-w-xl flex items-center justify-between pb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-forest-green text-surface rounded-xl shadow-xs">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold font-heading text-forest-green">Humanity First</h1>
            <p className="text-xs text-muted-text font-mono">Public Certificate Verification Registry</p>
          </div>
        </div>

        <Link to="/login" className="text-xs font-mono font-bold text-forest-green hover:underline">
          Portal Login →
        </Link>
      </header>

      {/* Main Verification Status Card */}
      <main className="w-full max-w-xl bg-surface p-8 rounded-3xl border border-line-border shadow-xl space-y-6">
        {loading ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-forest-green border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-semibold font-heading text-forest-green">Querying Public Certificate Registry...</p>
          </div>
        ) : valid && certData ? (
          <>
            {/* Valid Status Header */}
            <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-line-border">
              <div className="w-16 h-16 rounded-full bg-green-soft text-forest-green flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-10 h-10" />
              </div>

              <span className="px-3 py-1 rounded-full bg-green-soft text-forest-green text-xs font-mono font-extrabold tracking-wider uppercase">
                ✓ OFFICIALLY VERIFIED CREDENTIAL
              </span>

              <h2 className="text-2xl font-extrabold font-heading text-ink">
                Authentic NGO Credential
              </h2>

              <p className="text-xs text-muted-text max-w-md font-sans">
                This certificate has been validated against the official Humanity First NGO Learning Hub registry.
              </p>
            </div>

            {/* Details Table */}
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-bg-warm border border-line-border space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-line-border/60">
                  <span className="text-muted-text font-mono flex items-center gap-1.5">
                    <User className="w-4 h-4 text-forest-green" /> Recipient Name
                  </span>
                  <span className="font-extrabold font-heading text-sm text-ink">{certData.issuedTo}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-line-border/60">
                  <span className="text-muted-text font-mono flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-forest-green" /> Program Title
                  </span>
                  <span className="font-bold font-heading text-ink text-right">{certData.courseTitle}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-line-border/60">
                  <span className="text-muted-text font-mono flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-forest-green" /> Issue Date
                  </span>
                  <span className="font-mono text-ink">
                    {new Date(certData.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-text font-mono">Credential ID</span>
                  <span className="font-mono font-extrabold text-terracotta bg-alt-bg px-2 py-0.5 rounded">
                    {certData.certificateId}
                  </span>
                </div>
              </div>
            </div>

            {/* Issuer Badge Footer */}
            <div className="text-center pt-2">
              <p className="text-[11px] font-mono text-muted-text">
                Issued by: <strong className="text-ink">Humanity First Learning Hub</strong>
              </p>
            </div>
          </>
        ) : (
          /* Invalid Certificate View */
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-terracotta-soft text-terracotta flex items-center justify-center mx-auto">
              <XCircle className="w-10 h-10" />
            </div>

            <h2 className="text-xl font-extrabold font-heading text-ink">Invalid Certificate</h2>
            
            <p className="text-xs text-muted-text max-w-sm mx-auto">
              {error || `The certificate ID '${certId}' could not be verified in our registry.`}
            </p>

            <div className="pt-2">
              <Link to="/login" className="inline-flex items-center gap-2 text-xs font-mono font-bold text-forest-green hover:underline">
                <ArrowLeft className="w-4 h-4" /> Return to Main Portal
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-xl text-center pt-8 text-[11px] text-muted-text font-mono">
        © 2026 Humanity First NGO. Verification registry protected by JWT signatures.
      </footer>
    </div>
  );
};

export default VerifyCertificate;
