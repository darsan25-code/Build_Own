import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/server/security/auth';
import { db } from '@/server/db/client';
import { Award, Download, CheckCircle2, ArrowLeft, ExternalLink } from 'lucide-react';

export default async function StudentCertificatesPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const certificates = await db.certificate.findMany({
    where: { userId: user.id },
    include: { event: { include: { chapter: true } } },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <Link href="/student" className="acm-back-btn">
        <ArrowLeft className="acm-back-icon" />
        <span>Back to Dashboard</span>
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Certificates</h1>
          <p className="text-xs text-slate-500 mt-0.5">Verified certificates earned for event participation and technical achievements.</p>
        </div>

        <div className="space-y-4">
          {certificates.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl text-xs text-slate-500">
              No certificates issued yet. Complete event attendance to earn verifiable credentials!
            </div>
          ) : (
            certificates.map((cert) => (
              <div key={cert.id} className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#005596] flex items-center justify-center border border-blue-100 flex-shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{cert.event.title}</div>
                    <div className="text-[11px] text-slate-500">
                      Code: <span className="font-mono text-slate-700">{cert.certificateCode}</span> • Issued: {new Date(cert.issuedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <Link
                  href={`/certificates/${cert.certificateCode}`}
                  className="px-4 py-2 bg-[#005596] hover:bg-[#003B6E] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow transition-colors"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>View Certificate</span>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
