'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Play,
  Send,
  RotateCcw,
  Trophy,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Code2,
  Terminal,
  FileText,
  History,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  Zap,
} from 'lucide-react';

interface TestCase {
  id: string;
  inputData: string;
  expectedOutput: string;
  explanation?: string;
  orderIndex: number;
}

interface ProblemData {
  id: string;
  title: string;
  slug: string;
  orderIndex: number;
  difficulty: string;
  tags: string;
  points: number;
  statement: string;
  inputFormat?: string;
  outputFormat?: string;
  constraints?: string;
  starterCode: Record<string, string>;
  timeLimitMs: number;
  memoryLimitMb: number;
}

interface SubmissionRecord {
  id: string;
  language: string;
  status: string;
  score: number;
  executionTimeMs: number;
  submittedAt: string;
}

export default function CodingArenaPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const contestSlug = params.slug as string;
  const initialProblemSlug = searchParams.get('problem');

  const [contest, setContest] = useState<any>(null);
  const [problem, setProblem] = useState<ProblemData | null>(null);
  const [sampleTestCases, setSampleTestCases] = useState<TestCase[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Editor State
  const [language, setLanguage] = useState<string>('javascript');
  const [code, setCode] = useState<string>('');
  const [leftTab, setLeftTab] = useState<'DESCRIPTION' | 'SUBMISSIONS'>('DESCRIPTION');

  // Test Runner State
  const [selectedTestCaseIdx, setSelectedTestCaseIdx] = useState<number>(0);
  const [customInput, setCustomInput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [runResult, setRunResult] = useState<any>(null);
  const [submitResult, setSubmitResult] = useState<any>(null);
  const [queuedStatus, setQueuedStatus] = useState<string>('');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Timer State
  const [timeLeft, setTimeLeft] = useState<number>(7200); // seconds
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Load Problem Data
  useEffect(() => {
    fetchProblemData(initialProblemSlug || '');
  }, [contestSlug, initialProblemSlug]);

  // Live Timer Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Anti-Cheating Telemetry logs
  useEffect(() => {
    if (!contest?.id) return;

    const handleBlur = async () => {
      try {
        await fetch('/api/contests/activity-log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contestId: contest.id,
            type: 'TAB_BLUR',
            details: `User navigated away from the coding tab or switched focus at ${new Date().toLocaleTimeString()}`,
          }),
        });
      } catch (e) {
        // ignore
      }
    };

    const handlePaste = async (e: ClipboardEvent) => {
      try {
        await fetch('/api/contests/activity-log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contestId: contest.id,
            type: 'COPY_PASTE',
            details: `User pasted clipboard content at ${new Date().toLocaleTimeString()}`,
          }),
        });
      } catch (e) {
        // ignore
      }
    };

    window.addEventListener('blur', handleBlur);
    document.addEventListener('paste', handlePaste);

    return () => {
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('paste', handlePaste);
    };
  }, [contest]);

  const fetchProblemData = async (pSlug: string) => {
    try {
      setLoading(true);
      setRunResult(null);
      setSubmitResult(null);
      setQueuedStatus('');

      let targetSlug = pSlug;
      if (!targetSlug) {
        const cRes = await fetch(`/api/contests/${contestSlug}`);
        const cData = await cRes.json();
        if (cData.success && cData.contest.problems?.length > 0) {
          targetSlug = cData.contest.problems[0].slug;
        } else {
          setErrorMessage(cData.message || 'Contest details could not be loaded.');
        }
      }

      if (!targetSlug) {
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/contests/${contestSlug}/problems/${targetSlug}`);
      const data = await res.json();

      if (data.success) {
        setErrorMessage('');
        setContest(data.contest);
        setProblem(data.problem);
        setSampleTestCases(data.sampleTestCases || []);
        setSubmissions(data.userSubmissions || []);

        const starter = data.problem.starterCode?.[language] || data.problem.starterCode?.javascript || '';
        setCode(starter);

        if (data.sampleTestCases?.length > 0) {
          setCustomInput(data.sampleTestCases[0].inputData);
        }

        // Initialize Timer
        const now = new Date().getTime();
        const end = new Date(data.contest.endTime).getTime();
        setTimeLeft(Math.max(0, Math.floor((end - now) / 1000)));
      } else {
        setErrorMessage(data.message || 'Problem not found');
      }
    } catch (err: any) {
      console.error('Error fetching problem:', err);
      setErrorMessage(err.message || 'Failed to connect to the judge API');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    if (problem?.starterCode?.[newLang]) {
      setCode(problem.starterCode[newLang]);
    }
  };

  const handleResetCode = () => {
    if (problem?.starterCode?.[language]) {
      setCode(problem.starterCode[language]);
      setRunResult(null);
      setSubmitResult(null);
      setQueuedStatus('');
    }
  };

  const handleCopyInput = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  // Run Custom / Sample Testcase (Frontend execution wrapper)
  const handleRunCode = async () => {
    try {
      setIsRunning(true);
      setRunResult(null);

      const activeInput =
        selectedTestCaseIdx === -1
          ? customInput
          : sampleTestCases[selectedTestCaseIdx]?.inputData || customInput;

      const res = await fetch('/api/contests/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          code,
          input: activeInput,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setRunResult(data.result);
      } else {
        setRunResult({
          status: 'RUNTIME_ERROR',
          stderr: data.message || 'Execution error',
          stdout: '',
          executionTimeMs: 0,
        });
      }
    } catch (err: any) {
      setRunResult({
        status: 'RUNTIME_ERROR',
        stderr: err.message || 'Network error',
        stdout: '',
        executionTimeMs: 0,
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Submit Code & Poll database-backed queue for real-time verdict
  const handleSubmitCode = async () => {
    if (!contest || !problem) return;
    try {
      setIsSubmitting(true);
      setSubmitResult(null);
      setQueuedStatus('QUEUED');

      const res = await fetch('/api/contests/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contestId: contest.id,
          problemId: problem.id,
          language,
          code,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.message || 'Submission failed.');
        setQueuedStatus('');
        setIsSubmitting(false);
        return;
      }

      const submissionId = data.submissionId || data.submission?.id;
      pollSubmission(submissionId);
    } catch (err: any) {
      alert(err.message || 'Submission error');
      setQueuedStatus('');
      setIsSubmitting(false);
    }
  };

  const pollSubmission = (id: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/submissions/${id}`);
        const data = await res.json();

        if (data.success && data.submission) {
          const status = data.submission.status;
          setQueuedStatus(status);

          if (status !== 'QUEUED' && status !== 'COMPILING' && status !== 'RUNNING') {
            clearInterval(interval);
            setSubmitResult(data.submission);
            setIsSubmitting(false);
            setQueuedStatus('');
            // Refresh submissions list
            setSubmissions((prev) => [
              {
                id: data.submission.id,
                language: data.submission.language,
                status: data.submission.status,
                score: data.submission.score,
                executionTimeMs: data.submission.executionTimeMs,
                submittedAt: data.submission.submittedAt,
              },
              ...prev,
            ]);
          }
        }
      } catch (err) {
        clearInterval(interval);
        setQueuedStatus('');
        setIsSubmitting(false);
      }
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-3">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-semibold">Initializing ACM Online Judge Arena...</span>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-4">
        <AlertTriangle className="w-12 h-12 text-amber-500" />
        <h2 className="text-xl font-bold text-white">Access Denied / Error</h2>
        <p className="text-sm text-slate-400 text-center max-w-md px-6">{errorMessage}</p>
        <Link href={`/contests/${contestSlug}`} className="acm-back-btn-dark">
          <ArrowLeft className="acm-back-icon" />
          <span>Return to Contest Overview</span>
        </Link>
      </div>
    );
  }

  if (!problem || !contest) {
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-4">
        <AlertTriangle className="w-12 h-12 text-amber-500" />
        <h2 className="text-xl font-bold text-white">Problem Not Found</h2>
        <Link href={`/contests/${contestSlug}`} className="acm-back-btn-dark">
          <ArrowLeft className="acm-back-icon" />
          <span>Return to Contest Overview</span>
        </Link>
      </div>
    );
  }

  return (
    <div className={`flex flex-col bg-slate-950 text-slate-100 ${isFullscreen ? 'fixed inset-0 z-50' : 'h-[calc(100vh-4rem)]'}`}>
      {/* 1. TOP BAR */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-4">
          <Link
            href={`/contests/${contestSlug}`}
            className="acm-back-btn-dark"
          >
            <ArrowLeft className="acm-back-icon" />
            <span>Contest Hub</span>
          </Link>

          <div className="h-4 w-px bg-slate-800"></div>

          {/* Problem Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {contest.problems?.map((p: any, idx: number) => {
              const isActive = p.slug === problem.slug;
              return (
                <button
                  key={p.id}
                  onClick={() => fetchProblemData(p.slug)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <span>Q{p.orderIndex || idx + 1}</span>
                  <span className="hidden md:inline text-[11px] opacity-80 font-normal">({p.points} pts)</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Live Countdown Timer & Standings */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold tracking-wider">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <Link
            href={`/contests/${contestSlug}/leaderboard`}
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Leaderboard</span>
          </Link>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 2. MAIN SPLIT VIEW */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT PANEL: Problem Context & Submissions */}
        <div className="w-full lg:w-1/2 flex flex-col border-r border-slate-800 bg-slate-900/40 overflow-hidden">
          {/* Left Tabs */}
          <div className="h-11 border-b border-slate-800 bg-slate-900 px-4 flex items-center gap-4 shrink-0">
            <button
              onClick={() => setLeftTab('DESCRIPTION')}
              className={`h-full text-xs font-bold flex items-center gap-1.5 border-b-2 transition-colors ${
                leftTab === 'DESCRIPTION'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Problem Description
            </button>
            <button
              onClick={() => setLeftTab('SUBMISSIONS')}
              className={`h-full text-xs font-bold flex items-center gap-1.5 border-b-2 transition-colors ${
                leftTab === 'SUBMISSIONS'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Submissions ({submissions.length})
            </button>
          </div>

          {/* Left Panel Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {leftTab === 'DESCRIPTION' ? (
              <>
                {/* Title & Metadata */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                      Problem {problem.orderIndex}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                        problem.difficulty === 'EASY'
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                          : problem.difficulty === 'MEDIUM'
                          ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                          : 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">• {problem.points} Points</span>
                  </div>
                  <h1 className="text-2xl font-extrabold text-white mt-2">{problem.title}</h1>
                  <p className="text-xs text-slate-400 mt-1">Tags: {problem.tags}</p>
                </div>

                {/* Description Body */}
                <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line space-y-4">
                  {problem.statement}
                </div>

                {/* Input / Output Format */}
                {problem.inputFormat && (
                  <div className="space-y-1.5 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Input Format</h3>
                    <p className="text-xs text-slate-400 whitespace-pre-line">{problem.inputFormat}</p>
                  </div>
                )}

                {problem.outputFormat && (
                  <div className="space-y-1.5 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Output Format</h3>
                    <p className="text-xs text-slate-400 whitespace-pre-line">{problem.outputFormat}</p>
                  </div>
                )}

                {/* Constraints */}
                {problem.constraints && (
                  <div className="space-y-1.5 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Constraints</h3>
                    <pre className="text-xs font-mono text-amber-300/90 whitespace-pre-line">{problem.constraints}</pre>
                  </div>
                )}

                {/* Sample Test Cases */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    Sample Test Cases
                  </h3>

                  {sampleTestCases.map((tc, idx) => (
                    <div key={tc.id || idx} className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
                      <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-300">Sample #{idx + 1}</span>
                        <button
                          onClick={() => handleCopyInput(tc.inputData, idx)}
                          className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                        >
                          {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedIdx === idx ? 'Copied' : 'Copy Input'}
                        </button>
                      </div>
                      <div className="p-4 space-y-3 font-mono text-xs">
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase">Input</span>
                          <pre className="mt-1 p-2 bg-slate-900/80 rounded border border-slate-800 text-slate-200">{tc.inputData}</pre>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase">Expected Output</span>
                          <pre className="mt-1 p-2 bg-slate-900/80 rounded border border-slate-800 text-emerald-400 font-bold">{tc.expectedOutput}</pre>
                        </div>
                        {tc.explanation && (
                          <div className="text-slate-400 font-sans text-xs pt-1">
                            <span className="font-semibold text-slate-300">Explanation: </span>
                            {tc.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* Submissions Tab */
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">Your Past Submissions</h3>
                {submissions.length === 0 ? (
                  <p className="text-slate-500 text-xs">No submissions made yet for this problem.</p>
                ) : (
                  <div className="space-y-3">
                    {submissions.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded ${
                                sub.status === 'ACCEPTED'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                              }`}
                            >
                              {sub.status}
                            </span>
                            <span className="text-xs font-semibold text-white uppercase">{sub.language}</span>
                          </div>
                          <span className="text-xs text-slate-400 mt-1 block">
                            Score: <span className="font-bold text-white">{sub.score} pts</span> • {sub.executionTimeMs}ms
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          {new Date(sub.submittedAt).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Code Editor & Execution Console */}
        <div className="w-full lg:w-1/2 flex flex-col bg-slate-950 overflow-hidden">
          {/* Editor Header */}
          <div className="h-11 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Code2 className="w-4 h-4 text-blue-400" />
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs font-semibold rounded-lg px-2.5 py-1 focus:outline-none focus:border-blue-500"
              >
                <option value="javascript">JavaScript (Node.js 20)</option>
                <option value="python">Python 3.11</option>
                <option value="cpp">C++ (GCC 13)</option>
                <option value="java">Java 21</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetCode}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Interactive Code Editor */}
          <div className="flex-1 relative bg-slate-950 font-mono text-xs overflow-hidden flex">
            <div className="w-10 bg-slate-900/50 border-r border-slate-800 py-3 text-right pr-2 text-slate-600 select-none font-mono text-[11px] leading-relaxed hidden sm:block">
              {Array.from({ length: 45 }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="flex-1 bg-transparent text-slate-200 p-3 leading-relaxed focus:outline-none resize-none font-mono text-xs selection:bg-blue-600/40"
              placeholder="// Write your code solution here..."
            />
          </div>

          {/* 3. BOTTOM CONSOLE */}
          <div className="h-72 border-t border-slate-800 bg-slate-900/90 flex flex-col shrink-0">
            {/* Console Toolbar */}
            <div className="h-10 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                {sampleTestCases.map((tc, idx) => (
                  <button
                    key={tc.id || idx}
                    onClick={() => {
                      setSelectedTestCaseIdx(idx);
                      setCustomInput(tc.inputData);
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                      selectedTestCaseIdx === idx
                        ? 'bg-slate-800 text-blue-400 border border-blue-500/40 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Case {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => setSelectedTestCaseIdx(-1)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                    selectedTestCaseIdx === -1
                      ? 'bg-slate-800 text-blue-400 border border-blue-500/40 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  + Custom Input
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning || isSubmitting}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 border border-slate-700"
                >
                  <Play className="w-3.5 h-3.5 text-blue-400" />
                  {isRunning ? 'Running...' : 'Run Code'}
                </button>

                <button
                  onClick={handleSubmitCode}
                  disabled={isRunning || isSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/30 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-200" />
                  {isSubmitting ? `${queuedStatus || 'Submitting'}...` : 'Submit Solution'}
                </button>
              </div>
            </div>

            {/* Console Output Box */}
            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-3 bg-slate-950">
              {queuedStatus ? (
                <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>Submission is currently: <span className="text-emerald-400 font-bold">{queuedStatus}</span> in the Judge Queue...</span>
                </div>
              ) : submitResult ? (
                /* Submission Verdict Details */
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      {submitResult.status === 'ACCEPTED' ? (
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          <span>Accepted (Score Earned +{submitResult.score} pts)</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-rose-400 font-bold text-sm">
                          <XCircle className="w-5 h-5 text-rose-400" />
                          <span>{submitResult.status}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-slate-400 text-xs">Runtime: {submitResult.executionTimeMs}ms • Memory: {submitResult.memoryUsedMb}MB</span>
                  </div>

                  {submitResult.errorMessage && (
                    <pre className="p-3 bg-red-950/20 border border-red-500/20 text-rose-400 rounded-lg whitespace-pre-wrap">{submitResult.errorMessage}</pre>
                  )}

                  {/* Test Cases Results List */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {submitResult.testResults?.map((r: any, idx: number) => (
                      <div
                        key={r.id || idx}
                        className={`p-2.5 rounded-lg border text-xs flex flex-col justify-between ${
                          r.status === 'ACCEPTED'
                            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                            : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                        }`}
                      >
                        <div className="flex justify-between items-center font-bold">
                          <span>Case #{r.testCase?.orderIndex || idx + 1}</span>
                          <span>{r.status === 'ACCEPTED' ? '✓' : '✗'}</span>
                        </div>
                        <span className="text-[10px] opacity-80 mt-1">{r.executionTimeMs}ms</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Run Custom / Sample Input View */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                  <div className="flex flex-col">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1 font-sans">Standard Input (stdin)</span>
                    <textarea
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-blue-500 resize-none"
                      placeholder="Enter standard input..."
                    />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1 font-sans">Output / Execution Result</span>
                    <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-2.5 overflow-y-auto">
                      {runResult ? (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                runResult.status === 'ACCEPTED'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-rose-500/20 text-rose-400'
                              }`}
                            >
                              {runResult.status}
                            </span>
                            <span className="text-[10px] text-slate-500">{runResult.executionTimeMs}ms</span>
                          </div>
                          {runResult.stderr && <pre className="text-rose-400 whitespace-pre-wrap">{runResult.stderr}</pre>}
                          <pre className="text-emerald-400 whitespace-pre-wrap">{runResult.stdout || '(no stdout produced)'}</pre>
                        </div>
                      ) : (
                        <span className="text-slate-600 italic">Click &quot;Run Code&quot; to test your solution against this input.</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
