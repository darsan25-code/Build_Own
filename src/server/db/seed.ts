import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

async function main() {
  console.log('🌱 Starting ACM Platform Database Seeding with future dates and scaled Online Judge Contests (20/30/50 points)...');

  const passwordHash = await bcrypt.hash('Password123!', 12);

  // 1. Create Institutions
  const xyzInst = await db.institution.upsert({
    where: { code: 'XYZ' },
    update: {
      name: 'Vel Tech High Tech Dr.Rangarajan Dr.Sakunthala Engineering College',
      location: 'Avadi, Chennai, India',
    },
    create: {
      name: 'Vel Tech High Tech Dr.Rangarajan Dr.Sakunthala Engineering College',
      code: 'XYZ',
      domain: 'velhightech.com',
      location: 'Avadi, Chennai, India',
      country: 'India',
    },
  });

  const mitInst = await db.institution.upsert({
    where: { code: 'MIT' },
    update: {},
    create: {
      name: 'Massachusetts Institute of Technology',
      code: 'MIT',
      domain: 'mit.edu',
      location: 'Cambridge, MA',
      country: 'USA',
    },
  });

  const stanfordInst = await db.institution.upsert({
    where: { code: 'STANFORD' },
    update: {},
    create: {
      name: 'Stanford University',
      code: 'STANFORD',
      domain: 'stanford.edu',
      location: 'Stanford, CA',
      country: 'USA',
    },
  });

  // 2. Create Users
  const chapterAdmin = await db.user.upsert({
    where: { email: 'chapteradmin@xyz.edu' },
    update: {},
    create: {
      name: 'Sarah Connor',
      email: 'chapteradmin@xyz.edu',
      passwordHash,
      role: 'CHAPTER_ADMIN',
      accountType: 'Student',
      isVerified: true,
      studentId: 'ACM-ID-99001',
      department: 'Computer Science and Engineering',
      yearOfStudy: '4th Year',
      institutionId: xyzInst.id,
    },
  });

  const alexKumar = await db.user.upsert({
    where: { email: 'alex@xyz.edu' },
    update: {},
    create: {
      name: 'Alex Kumar',
      email: 'alex@xyz.edu',
      passwordHash,
      role: 'CHAPTER_MEMBER',
      accountType: 'Student',
      isVerified: true,
      studentId: '1234567',
      department: 'Computer Science and Engineering',
      yearOfStudy: '3rd Year',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      institutionId: xyzInst.id,
    },
  });

  const mitStudent = await db.user.upsert({
    where: { email: 'sarah@mit.edu' },
    update: {},
    create: {
      name: 'Sarah Jenkins',
      email: 'sarah@mit.edu',
      passwordHash,
      role: 'STUDENT',
      accountType: 'Student',
      isVerified: true,
      studentId: 'MIT-88401',
      department: 'Electrical Engineering & CS',
      yearOfStudy: '2nd Year',
      institutionId: mitInst.id,
    },
  });

  // 3. Create Chapters
  const xyzChapter = await db.chapter.upsert({
    where: { code: 'ACM-CH-123456' },
    update: {},
    create: {
      name: 'Vel Tech High Tech ACM Student Chapter',
      code: 'ACM-CH-123456',
      type: 'Student Chapter',
      status: 'APPROVED',
      description: 'Official ACM Student Chapter of Vel Tech High Tech Dr.Rangarajan Dr.Sakunthala Engineering College (Avadi, Chennai). Advancing computing as a science and profession.',
      foundedYear: 2021,
      institutionId: xyzInst.id,
    },
  });

  const mitChapter = await db.chapter.upsert({
    where: { code: 'ACM-CH-MIT' },
    update: {},
    create: {
      name: 'MIT ACM Student Chapter',
      code: 'ACM-CH-MIT',
      type: 'Student Chapter',
      status: 'APPROVED',
      description: 'MIT Chapter focusing on artificial intelligence, systems, and algorithms research.',
      foundedYear: 2018,
      institutionId: mitInst.id,
    },
  });

  const stanfordChapter = await db.chapter.upsert({
    where: { code: 'ACM-CH-STANFORD' },
    update: {},
    create: {
      name: 'Stanford ACM Student Chapter',
      code: 'ACM-CH-STANFORD',
      type: 'Student Chapter',
      status: 'APPROVED',
      description: 'Stanford University ACM Chapter driving innovation and technology leadership.',
      foundedYear: 2019,
      institutionId: stanfordInst.id,
    },
  });

  // 4. Create Memberships
  await db.chapterMembership.upsert({
    where: { chapterId_userId: { chapterId: xyzChapter.id, userId: alexKumar.id } },
    update: {},
    create: {
      chapterId: xyzChapter.id,
      userId: alexKumar.id,
      role: 'CHAPTER_MEMBER',
      status: 'ACTIVE',
    },
  });

  await db.chapterMembership.upsert({
    where: { chapterId_userId: { chapterId: xyzChapter.id, userId: chapterAdmin.id } },
    update: {},
    create: {
      chapterId: xyzChapter.id,
      userId: chapterAdmin.id,
      role: 'CHAPTER_ADMIN',
      status: 'ACTIVE',
    },
  });

  // 5. Create Event & Registration
  const now = Date.now();
  const future10Days = new Date(now + 10 * 86400000);

  const event1 = await db.event.upsert({
    where: { slug: 'acm-techtalk-generative-ai' },
    update: {
      startTime: future10Days,
      endTime: new Date(future10Days.getTime() + 7200000),
      registrationDeadline: future10Days,
    },
    create: {
      title: 'ACM TechTalk: Generative AI',
      slug: 'acm-techtalk-generative-ai',
      description: 'Deep dive into large language models, transformer architecture, and practical application development.',
      type: 'TECHNICAL_TALK',
      format: 'ONLINE',
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      maxCapacity: 100,
      currentRegistrations: 1,
      startTime: future10Days,
      endTime: new Date(future10Days.getTime() + 7200000),
      registrationDeadline: future10Days,
      location: 'Online (Zoom)',
      certificateEligible: true,
      chapterId: xyzChapter.id,
      institutionId: xyzInst.id,
    },
  });

  await db.eventRegistration.upsert({
    where: { eventId_userId: { eventId: event1.id, userId: alexKumar.id } },
    update: {},
    create: {
      eventId: event1.id,
      userId: alexKumar.id,
      registrationCode: 'REG-ACM-GENAI-001',
      status: 'CONFIRMED',
      attended: true,
    },
  });

  await db.certificate.upsert({
    where: { userId_eventId: { userId: alexKumar.id, eventId: event1.id } },
    update: {},
    create: {
      certificateCode: 'ACM-CERT-2026-88910',
      userId: alexKumar.id,
      eventId: event1.id,
      pdfAssetUrl: '/certificates/ACM-CERT-2026-88910',
    },
  });

  // 6. Create Coding Contests
  const nationalContest = await db.contest.upsert({
    where: { slug: 'acm-national-algorithmic-challenge-2026' },
    update: {
      status: 'LIVE',
      startTime: new Date(now - 3600000),
      endTime: new Date(now + 3 * 3600000),
      registrationDeadline: new Date(now + 2 * 3600000),
    },
    create: {
      title: 'ACM National Algorithmic Challenge 2026',
      slug: 'acm-national-algorithmic-challenge-2026',
      description: 'The premier national collegiate programming contest hosted by the ACM Student Chapter.',
      rules: '1. Languages Supported: Python 3, JavaScript. 2. Scoring: Ranked by Total Score.',
      status: 'LIVE',
      startTime: new Date(now - 3600000),
      endTime: new Date(now + 3 * 3600000),
      registrationDeadline: new Date(now + 2 * 3600000),
      durationMinutes: 180,
      prizePool: '₹25,000 + ACM Official Certificates',
      visibility: 'PUBLIC',
      maxParticipants: 150,
      scoring: 'STANDARD',
      penaltyRules: 20,
      chapterId: xyzChapter.id,
      creatorId: chapterAdmin.id,
    },
  });

  // 7. Create Problems & Testcases with new 20, 30, 50 point scale
  // Problem 1: Two Sum Subarray Target (EASY -> 20 Points)
  const p1 = await db.problem.upsert({
    where: { contestId_slug: { contestId: nationalContest.id, slug: 'two-sum-target' } },
    update: { points: 20 },
    create: {
      contestId: nationalContest.id,
      title: 'Subarray Target Sum Indices',
      slug: 'two-sum-target',
      orderIndex: 1,
      difficulty: 'EASY',
      tags: 'Arrays, Hash Map',
      points: 20,
      statement: `Given an array of integers \`nums\` and an integer \`target\`, return the **0-based indices** of the two numbers such that they add up to \`target\`.`,
      inputFormat: `First line contains N and target. Second line contains N integers.`,
      outputFormat: `Print indices 'i j'.`,
      constraints: `2 <= nums.length <= 10^5`,
      starterCode: JSON.stringify({
        javascript: `function solve() {\n  const line1 = readline().trim().split(/\\s+/);\n  if (!line1 || line1.length < 2) return;\n  const n = parseInt(line1[0], 10);\n  const target = parseInt(line1[1], 10);\n  const nums = readList();\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      console.log(map.get(complement) + " " + i);\n      return;\n    }\n    map.set(nums[i], i);\n  }\n}\nsolve();`,
        python: `import sys\ndef solve():\n    lines = sys.stdin.read().strip().split('\\n')\n    if not lines or len(lines) < 2: return\n    n, target = map(int, lines[0].split())\n    nums = list(map(int, lines[1].split()))\n    seen = {}\n    for i, x in enumerate(nums):\n        diff = target - x\n        if diff in seen:\n            print(f"{seen[diff]} {i}")\n            return\n        seen[x] = i\nif __name__ == '__main__': solve()`,
      }),
      testCases: {
        create: [
          {
            inputData: '4 9\n2 7 11 15',
            expectedOutput: '0 1',
            isHidden: false,
            weight: 10,
            orderIndex: 1,
          },
          {
            inputData: '3 6\n3 2 4',
            expectedOutput: '1 2',
            isHidden: false,
            weight: 10,
            orderIndex: 2,
          },
        ],
      },
    },
  });

  // Problem 2: Longest Palindromic Substring (MEDIUM -> 30 Points)
  const p2 = await db.problem.upsert({
    where: { contestId_slug: { contestId: nationalContest.id, slug: 'longest-palindrome-substring' } },
    update: { points: 30 },
    create: {
      contestId: nationalContest.id,
      title: 'Longest Palindromic Substring',
      slug: 'longest-palindrome-substring',
      orderIndex: 2,
      difficulty: 'MEDIUM',
      tags: 'Strings, Dynamic Programming',
      points: 30,
      statement: `Given a string \`s\`, return the **longest palindromic substring** in \`s\`.`,
      inputFormat: `A single line containing s.`,
      outputFormat: `Print the longest palindromic substring.`,
      constraints: `1 <= s.length <= 1000`,
      starterCode: JSON.stringify({
        javascript: `function solve() {\n  const s = readline().trim();\n  if (s.length <= 1) { console.log(s); return; }\n  let start = 0, maxLen = 1;\n  function expand(l, r) {\n    while (l >= 0 && r < s.length && s[l] === s[r]) {\n      if (r - l + 1 > maxLen) { start = l; maxLen = r - l + 1; }\n      l--; r++;\n    }\n  }\n  for (let i = 0; i < s.length; i++) { expand(i, i); expand(i, i + 1); }\n  console.log(s.substring(start, start + maxLen));\n}\nsolve();`,
      }),
      testCases: {
        create: [
          {
            inputData: 'babad',
            expectedOutput: 'bab',
            isHidden: false,
            weight: 15,
            orderIndex: 1,
          },
          {
            inputData: 'cbbd',
            expectedOutput: 'bb',
            isHidden: false,
            weight: 15,
            orderIndex: 2,
          },
        ],
      },
    },
  });

  // Problem 3: MST Network Spanning (HARD -> 50 Points)
  const p3 = await db.problem.upsert({
    where: { contestId_slug: { contestId: nationalContest.id, slug: 'min-cost-network-spanning' } },
    update: { points: 50 },
    create: {
      contestId: nationalContest.id,
      title: 'Campus High-Speed Fiber Network',
      slug: 'min-cost-network-spanning',
      orderIndex: 3,
      difficulty: 'HARD',
      tags: 'Graphs, Minimum Spanning Tree',
      points: 50,
      statement: `Find the **minimum total cost** to connect all laboratories.`,
      inputFormat: `First line contains N and M. Following M lines contain u, v, cost.`,
      outputFormat: `Print MST cost or -1.`,
      constraints: `2 <= N <= 10^5`,
      starterCode: JSON.stringify({
        javascript: `function solve() {\n  const line1 = readline().trim().split(/\\s+/);\n  if (!line1 || line1.length < 2) return;\n  const n = parseInt(line1[0], 10);\n  const m = parseInt(line1[1], 10);\n  const edges = [];\n  for (let i = 0; i < m; i++) {\n    const edge = readList();\n    if (edge.length >= 3) edges.push({ u: edge[0], v: edge[1], cost: edge[2] });\n  }\n  edges.sort((a, b) => a.cost - b.cost);\n  const parent = Array.from({ length: n + 1 }, (_, i) => i);\n  function find(i) { return parent[i] === i ? i : (parent[i] = find(parent[i])); }\n  let totalCost = 0, count = 0;\n  for (const { u, v, cost } of edges) {\n    const rootU = find(u), rootV = find(v);\n    if (rootU !== rootV) {\n      parent[rootU] = rootV;\n      totalCost += cost;\n      count++;\n      if (count === n - 1) break;\n    }\n  }\n  console.log(count === n - 1 ? totalCost : -1);\n}\nsolve();`,
      }),
      testCases: {
        create: [
          {
            inputData: '4 5\n1 2 1\n1 3 4\n2 3 2\n2 4 5\n3 4 3',
            expectedOutput: '6',
            isHidden: false,
            weight: 25,
            orderIndex: 1,
          },
          {
            inputData: '3 1\n1 2 5',
            expectedOutput: '-1',
            isHidden: false,
            weight: 25,
            orderIndex: 2,
          },
        ],
      },
    },
  });

  // 8. Registrations
  await db.contestParticipant.upsert({
    where: { contestId_userId: { contestId: nationalContest.id, userId: alexKumar.id } },
    update: {},
    create: {
      contestId: nationalContest.id,
      userId: alexKumar.id,
      status: 'ACTIVE',
    },
  });

  await db.contestParticipant.upsert({
    where: { contestId_userId: { contestId: nationalContest.id, userId: mitStudent.id } },
    update: {},
    create: {
      contestId: nationalContest.id,
      userId: mitStudent.id,
      status: 'ACTIVE',
    },
  });

  // 9. Scaled Leaderboard Entries
  await db.leaderboardEntry.upsert({
    where: { contestId_userId: { contestId: nationalContest.id, userId: mitStudent.id } },
    update: { score: 100, rank: 1 },
    create: {
      contestId: nationalContest.id,
      userId: mitStudent.id,
      userName: 'Sarah Jenkins',
      userEmail: 'sarah@mit.edu',
      institutionName: 'Massachusetts Institute of Technology',
      rank: 1,
      score: 100,
      totalPenaltyTime: 1840,
      problemScores: JSON.stringify({
        'two-sum-target': { score: 20, time: 240 },
        'longest-palindrome-substring': { score: 30, time: 600 },
        'min-cost-network-spanning': { score: 50, time: 1000 },
      }),
    },
  });

  await db.leaderboardEntry.upsert({
    where: { contestId_userId: { contestId: nationalContest.id, userId: alexKumar.id } },
    update: { score: 50, rank: 2 },
    create: {
      contestId: nationalContest.id,
      userId: alexKumar.id,
      userName: 'Alex Kumar',
      userEmail: 'alex@xyz.edu',
      institutionName: 'Vel Tech High Tech Engineering College',
      rank: 2,
      score: 50,
      totalPenaltyTime: 2450,
      problemScores: JSON.stringify({
        'two-sum-target': { score: 20, time: 350 },
        'longest-palindrome-substring': { score: 30, time: 2100 },
      }),
    },
  });

  console.log('🚀 Seeding with scaled 20 / 30 / 50 points finished successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
