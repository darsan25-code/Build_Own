import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/server/db/client';
import { Award, CheckCircle2, Building, Calendar, ArrowLeft, ShieldCheck } from 'lucide-react';

interface Props {
  params: { code: string };
}

export default async function CertificateVerificationPage({ params }: Props) {
  const cert = await db.certificate.findUnique({
    where: { certificateCode: params.code },
    include: {
      user: { include: { institution: true } },
      event: { include: { chapter: true } },
    },
  });

  if (!cert) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <Link href="/" className="acm-back-btn">
        <ArrowLeft className="acm-back-icon" />
        <span>Return to Platform Home</span>
      </Link>

      <div className="bg-white border-2 border-[#005596]/30 rounded-3xl p-8 sm:p-12 shadow-lg text-center space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-[#005596] text-white text-[10px] font-bold uppercase px-4 py-1.5 rounded-bl-xl flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Verified Credential
        </div>

        <div className="space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#005596] mx-auto flex items-center justify-center border border-blue-100 shadow-sm">
            <Award className="w-8 h-8" />
          </div>
          <div className="text-xs font-bold text-[#005596] uppercase tracking-wider">Association for Computing Machinery</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Certificate of Achievement</h1>
        </div>

        <div className="space-y-2 py-4 border-y border-slate-100">
          <p className="text-xs text-slate-500">This certifies that</p>
          <div className="text-2xl font-bold text-[#005596]">{cert.user.name}</div>
          <p className="text-xs text-slate-600 font-medium">{cert.user.institution?.name || 'ACM Member'}</p>
          <p className="text-xs text-slate-500 pt-2">has successfully participated in and completed</p>
          <div className="text-lg font-bold text-slate-900">{cert.event.title}</div>
          <p className="text-xs text-slate-500">Hosted by {cert.event.chapter.name}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs max-w-md mx-auto text-left bg-slate-50 p-4 rounded-xl">
          <div>
            <span className="text-slate-500 block">Certificate ID</span>
            <span className="font-mono font-bold text-slate-900">{cert.certificateCode}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Issue Date</span>
            <span className="font-bold text-slate-900">{new Date(cert.issuedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
