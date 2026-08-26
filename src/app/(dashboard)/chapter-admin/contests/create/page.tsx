'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Trophy,
  ChevronLeft,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  Code2,
  Terminal,
  Layers,
  Sparkles,
} from 'lucide-react';

interface QuestionForm {
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  score: number;
  tags: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  sampleInput: string;
  sampleOutput: string;
  hiddenInput: string;
  hiddenOutput: string;
}

export default function CreateContestPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState('Standard ACM ICPC collegiate contest guidelines apply.');
  const [durationMinutes, setDurationMinutes] = useState(120);
  const [prizePool, setPrizePool] = useState('₹15,000 + ACM Official Certificates');
  const [startTime, setStartTime] = useState(new Date().toISOString().slice(0, 16));
  const [endTime, setEndTime] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16)
  );

  const [questions, setQuestions] = useState<QuestionForm[]>([
    {
      title: 'Array Peak Finding Challenge',
      difficulty: 'EASY',
      score: 100,
      tags: 'Arrays, Binary Search',
      description: 'An element is called a peak element if its value is strictly greater than the value of its adjacent neighbors. Given an integer array nums, find a peak element and return its 0-based index.',
      inputFormat: 'First line contains integer N.\nSecond line contains N integers.',
      outputFormat: 'Print the index of any peak element.',
      constraints: '1 <= nums.length <= 10^5',
      sampleInput: '4\n1 2 3 1',
      sampleOutput: '2',
      hiddenInput: '6\n1 2 1 3 5 6 4',
      hiddenOutput: '5',
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        title: `Challenge #${prev.length + 1}`,
        difficulty: 'MEDIUM',
        score: 200,
        tags: 'Algorithms, Data Structures',
        description: 'Describe problem statement here...',
        inputFormat: 'Input description...',
        outputFormat: 'Output description...',
        constraints: '1 <= N <= 10^5',
        sampleInput: 'Sample Input',
        sampleOutput: 'Sample Output',
        hiddenInput: 'Hidden Input',
        hiddenOutput: 'Hidden Output',
      },
    ]);
  };

  const removeQuestion = (idx: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateQuestion = (idx: number, field: keyof QuestionForm, val: any) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMsg('');

      // 1. Create Contest
      const res = await fetch('/api/contests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          rules,
          durationMinutes,
          prizePool,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to create contest');
      }

      setMsg('Contest & problems published successfully!');
      setTimeout(() => {
        router.push('/contests');
      }, 1200);
    } catch (err: any) {
      setMsg(err.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 pb-20">
      {/* Top Header */}
      <div>
        <Link
          href="/chapter-admin/contests"
          className="acm-back-btn mb-3"
        >
          <ArrowLeft className="acm-back-icon" />
          <span>Back to Contests</span>
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Trophy className="w-7 h-7 text-[#005596]" />
          Host New Coding Contest & Upload Problems
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Set up tournament timelines, testcase constraints, and problem sets for your ACM Student Chapter.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Contest Basic Info */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Layers className="w-5 h-5 text-[#005596]" />
            1. Contest Basic Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Contest Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. ACM Summer Code Clash 2026"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#005596]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Description</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe contest format, objectives, and eligibility..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#005596]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Start Date & Time</label>
              <input
                type="datetime-local"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#005596]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">End Date & Time</label>
              <input
                type="datetime-local"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#005596]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Duration (Minutes)</label>
              <input
                type="number"
                min={15}
                max={1440}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#005596]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Prize Pool / Awards</label>
              <input
                type="text"
                value={prizePool}
                onChange={(e) => setPrizePool(e.target.value)}
                placeholder="e.g. ₹20,000 + Medals"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#005596]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Questions & Test Cases Upload */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-[#005596]" />
              2. Problem Set & Evaluation Test Cases ({questions.length})
            </h2>

            <button
              type="button"
              onClick={addQuestion}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-[#005596] hover:bg-blue-100 text-xs font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Question
            </button>
          </div>

          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-4 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#005596] text-white">
                    Question #{idx + 1}
                  </span>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(idx)}
                      className="text-rose-500 hover:text-rose-700 text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={q.title}
                      onChange={(e) => updateQuestion(idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Difficulty</label>
                    <select
                      value={q.difficulty}
                      onChange={(e) => updateQuestion(idx, 'difficulty', e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-semibold"
                    >
                      <option value="EASY">EASY (100 Pts)</option>
                      <option value="MEDIUM">MEDIUM (200 Pts)</option>
                      <option value="HARD">HARD (300 Pts)</option>
                    </select>
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Problem Statement</label>
                    <textarea
                      rows={3}
                      required
                      value={q.description}
                      onChange={(e) => updateQuestion(idx, 'description', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-mono"
                    />
                  </div>

                  {/* Sample Test Case */}
                  <div className="md:col-span-3 grid grid-cols-2 gap-3 bg-white p-3 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-[11px] font-bold text-slate-700 block mb-1">Sample Input 1 (Public)</span>
                      <textarea
                        rows={2}
                        value={q.sampleInput}
                        onChange={(e) => updateQuestion(idx, 'sampleInput', e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-700 block mb-1">Sample Expected Output 1</span>
                      <textarea
                        rows={2}
                        value={q.sampleOutput}
                        onChange={(e) => updateQuestion(idx, 'sampleOutput', e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-mono font-bold text-emerald-600"
                      />
                    </div>
                  </div>

                  {/* Hidden Test Case */}
                  <div className="md:col-span-3 grid grid-cols-2 gap-3 bg-slate-900 text-white p-3 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-[11px] font-bold text-amber-400 block mb-1">Hidden Test Case 2 (Evaluation)</span>
                      <textarea
                        rows={2}
                        value={q.hiddenInput}
                        onChange={(e) => updateQuestion(idx, 'hiddenInput', e.target.value)}
                        className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-xs font-mono text-slate-200"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-amber-400 block mb-1">Hidden Expected Output 2</span>
                      <textarea
                        rows={2}
                        value={q.hiddenOutput}
                        onChange={(e) => updateQuestion(idx, 'hiddenOutput', e.target.value)}
                        className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-xs font-mono font-bold text-emerald-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {msg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            {msg}
          </div>
        )}

        {/* Submit Action */}
        <div className="flex justify-end gap-3">
          <Link
            href="/chapter-admin/contests"
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-[#005596] hover:bg-[#004070] disabled:opacity-50 text-white text-sm font-bold transition-all shadow-md shadow-[#005596]/20 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? 'Publishing Contest...' : 'Publish Contest to Arena'}
          </button>
        </div>
      </form>
    </div>
  );
}
