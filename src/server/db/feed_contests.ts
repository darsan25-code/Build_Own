import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  console.log('🌱 Feeding 10 new ACM Coding Contests into the database...');

  const chapter = await db.chapter.findFirst({
    where: { name: { contains: 'Vel Tech' } },
  });

  const creator = await db.user.findFirst({
    where: { role: 'CHAPTER_ADMIN' },
  });

  if (!chapter || !creator) {
    console.error('❌ Required Chapter or Creator not found! Please run regular seed first.');
    process.exit(1);
  }

  const baseContestsData = [
    {
      title: 'Vel Tech Algorithmic CodeRun 2026 (Round 1 - Online)',
      slug: 'vel-tech-algorithmic-coderun-2026-online',
      description: 'The inaugural round of the CodeRun series. Pure algorithmic speed run.',
      rules: 'Standard online judge rules. Python 3 and JavaScript allowed.',
      status: 'COMPLETED',
      startTime: new Date('2026-06-15T10:00:00Z'),
      endTime: new Date('2026-06-15T13:00:00Z'),
      registrationDeadline: new Date('2026-06-15T09:00:00Z'),
      durationMinutes: 180,
      prizePool: 'ACM Goodies + Digital Certificates',
      visibility: 'PUBLIC',
      maxParticipants: 200,
      problem: {
        title: 'Reverse Integer',
        slug: 'reverse-integer',
        difficulty: 'EASY',
        points: 20,
        statement: 'Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.',
        inputFormat: 'One integer x.',
        outputFormat: 'Reversed integer.',
        constraints: '-2^31 <= x <= 2^31 - 1',
        starterCode: {
          javascript: `function solve() {\n  const line = readline().trim();\n  if (!line) return;\n  const x = parseInt(line, 10);\n  const sign = x < 0 ? -1 : 1;\n  const reversed = parseInt(Math.abs(x).toString().split('').reverse().join(''), 10) * sign;\n  if (reversed < -Math.pow(2, 31) || reversed > Math.pow(2, 31) - 1) {\n    console.log(0);\n  } else {\n    console.log(reversed);\n  }\n}\nsolve();`,
          python: `import sys\ndef solve():\n    line = sys.stdin.read().strip()\n    if not line: return\n    x = int(line)\n    sign = -1 if x < 0 else 1\n    rev = int(str(abs(x))[::-1]) * sign\n    if rev < -2**31 or rev > 2**31 - 1:\n        print(0)\n    else:\n        print(rev)\nif __name__ == '__main__': solve()`,
        },
        testCases: [
          { inputData: '123', expectedOutput: '321', isHidden: false, weight: 10, orderIndex: 1 },
          { inputData: '-123', expectedOutput: '-321', isHidden: false, weight: 10, orderIndex: 2 }
        ]
      }
    },
    {
      title: 'Vel Tech Offline CodeQuest 2026 (Round 2 - Lab 3)',
      slug: 'vel-tech-offline-codequest-2026-lab3',
      description: 'Second round conducted offline inside the Main Computing Lab 3.',
      rules: 'Strict offline monitoring. No external resources or web browsing allowed.',
      status: 'COMPLETED',
      startTime: new Date('2026-07-10T11:00:00Z'),
      endTime: new Date('2026-07-10T13:00:00Z'),
      registrationDeadline: new Date('2026-07-10T10:00:00Z'),
      durationMinutes: 120,
      prizePool: 'Cash reward of ₹5,000 + ACM Medals',
      visibility: 'PUBLIC',
      maxParticipants: 100,
      problem: {
        title: 'Valid Parentheses',
        slug: 'valid-parentheses',
        difficulty: 'EASY',
        points: 20,
        statement: 'Given a string containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
        inputFormat: 'A string s containing parentheses characters.',
        outputFormat: 'Return "true" if valid, else "false".',
        constraints: '1 <= s.length <= 10^4',
        starterCode: {
          javascript: `function solve() {\n  const s = readline().trim();\n  const stack = [];\n  const pairs = { ")": "(", "}": "{", "]": "[" };\n  for (let c of s) {\n    if (pairs[c]) {\n      if (!stack.length || stack[stack.length - 1] !== pairs[c]) {\n        console.log("false");\n        return;\n      }\n      stack.pop();\n    } else {\n      stack.push(c);\n    }\n  }\n  console.log(stack.length === 0 ? "true" : "false");\n}\nsolve();`,
          python: `import sys\ndef solve():\n    s = sys.stdin.read().strip()\n    stack = []\n    pairs = { ")": "(", "}": "{", "]": "[" }\n    for c in s:\n        if c in pairs:\n            if not stack or stack[-1] != pairs[c]:\n                print("false")\n                return\n            stack.pop()\n        else:\n            stack.append(c)\n    print("true" if not stack else "false")\nif __name__ == '__main__': solve()`,
        },
        testCases: [
          { inputData: '()[]{}', expectedOutput: 'true', isHidden: false, weight: 10, orderIndex: 1 },
          { inputData: '(]', expectedOutput: 'false', isHidden: false, weight: 10, orderIndex: 2 }
        ]
      }
    },
    {
      title: 'Vel Tech Independence Day Coding Derby (Online)',
      slug: 'vel-tech-independence-day-coding-derby',
      description: 'Special national level programming challenge celebrating Independence Day.',
      rules: 'Anti-cheat monitors are active. Leaderboard resets at midnight.',
      status: 'LIVE',
      startTime: new Date(Date.now() - 3600000), // Active now
      endTime: new Date(Date.now() + 86400000 * 3),
      registrationDeadline: new Date(Date.now() + 86400000 * 2),
      durationMinutes: 1440,
      prizePool: 'Trophy + ₹10,000 Cash Pool',
      visibility: 'PUBLIC',
      maxParticipants: 500,
      problem: {
        title: 'Best Time to Buy and Sell Stock',
        slug: 'best-time-to-buy-sell-stock',
        difficulty: 'EASY',
        points: 20,
        statement: 'You are given an array prices where prices[i] is the price of a given stock on the i-th day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.',
        inputFormat: 'First line contains N. Second line contains prices.',
        outputFormat: 'Max profit value.',
        constraints: '1 <= prices.length <= 10^5',
        starterCode: {
          javascript: `function solve() {\n  const lines = readlines();\n  if (lines.length < 2) return;\n  const prices = lines[1].trim().split(/\\s+/).map(Number);\n  let minPrice = Infinity;\n  let maxProfit = 0;\n  for (let price of prices) {\n    if (price < minPrice) minPrice = price;\n    else if (price - minPrice > maxProfit) maxProfit = price - minPrice;\n  }\n  console.log(maxProfit);\n}\nsolve();`,
          python: `import sys\ndef solve():\n    lines = sys.stdin.read().strip().split('\\n')\n    if len(lines) < 2: return\n    prices = list(map(int, lines[1].split()))\n    min_price = float('inf')\n    max_profit = 0\n    for p in prices:\n        if p < min_price:\n            min_price = p\n        elif p - min_price > max_profit:\n            max_profit = p - min_price\n    print(max_profit)\nif __name__ == '__main__': solve()`,
        },
        testCases: [
          { inputData: '6\n7 1 5 3 6 4', expectedOutput: '5', isHidden: false, weight: 10, orderIndex: 1 },
          { inputData: '5\n7 6 4 3 1', expectedOutput: '0', isHidden: false, weight: 10, orderIndex: 2 }
        ]
      }
    },
    {
      title: 'Vel Tech HackFest 2026 Prep Contest (Online)',
      slug: 'vel-tech-hackfest-2026-prep',
      description: 'Practice round to prepare student developers for the annual HackFest event.',
      rules: 'Standard online judge format.',
      status: 'UPCOMING',
      startTime: new Date('2026-09-01T14:00:00Z'),
      endTime: new Date('2026-09-01T17:00:00Z'),
      registrationDeadline: new Date('2026-09-01T13:00:00Z'),
      durationMinutes: 180,
      prizePool: 'ACM Badge + Direct HackFest Entry',
      visibility: 'PUBLIC',
      maxParticipants: 300,
      problem: {
        title: 'Climbing Stairs',
        slug: 'climbing-stairs',
        difficulty: 'EASY',
        points: 20,
        statement: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
        inputFormat: 'An integer n.',
        outputFormat: 'Number of distinct ways.',
        constraints: '1 <= n <= 45',
        starterCode: {
          javascript: `function solve() {\n  const n = parseInt(readline().trim(), 10);\n  if (n <= 2) { console.log(n); return; }\n  let a = 1, b = 2;\n  for (let i = 3; i <= n; i++) {\n    let c = a + b;\n    a = b;\n    b = c;\n  }\n  console.log(b);\n}\nsolve();`,
          python: `import sys\ndef solve():\n    n = int(sys.stdin.read().strip())\n    if n <= 2:\n        print(n)\n        return\n    a, b = 1, 2\n    for _ in range(3, n + 1):\n        a, b = b, a + b\n    print(b)\nif __name__ == '__main__': solve()`,
        },
        testCases: [
          { inputData: '2', expectedOutput: '2', isHidden: false, weight: 10, orderIndex: 1 },
          { inputData: '3', expectedOutput: '3', isHidden: false, weight: 10, orderIndex: 2 }
        ]
      }
    },
    {
      title: 'Vel Tech ACM Intra-College Coding Showdown (Offline)',
      slug: 'vel-tech-acm-intra-college-showdown',
      description: 'Intra-college showdown hosted inside the CSE block seminar hall.',
      rules: 'Must be present physically. Internet connection is isolated.',
      status: 'UPCOMING',
      startTime: new Date('2026-09-15T09:00:00Z'),
      endTime: new Date('2026-09-15T12:00:00Z'),
      registrationDeadline: new Date('2026-09-15T08:00:00Z'),
      durationMinutes: 180,
      prizePool: 'Shield of Honor + Certificates',
      visibility: 'PUBLIC',
      maxParticipants: 120,
      problem: {
        title: 'Maximum Subarray',
        slug: 'maximum-subarray',
        difficulty: 'MEDIUM',
        points: 30,
        statement: 'Given an integer array nums, find the subarray with the largest sum and return its sum.',
        inputFormat: 'First line contains N. Second line contains the array numbers.',
        outputFormat: 'Max sum of the contiguous subarray.',
        constraints: '1 <= nums.length <= 10^5',
        starterCode: {
          javascript: `function solve() {\n  const lines = readlines();\n  if (lines.length < 2) return;\n  const nums = lines[1].trim().split(/\\s+/).map(Number);\n  let maxSoFar = nums[0];\n  let currMax = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    currMax = Math.max(nums[i], currMax + nums[i]);\n    maxSoFar = Math.max(maxSoFar, currMax);\n  }\n  console.log(maxSoFar);\n}\nsolve();`,
          python: `import sys\ndef solve():\n    lines = sys.stdin.read().strip().split('\\n')\n    if len(lines) < 2: return\n    nums = list(map(int, lines[1].split()))\n    max_so_far = nums[0]\n    curr_max = nums[0]\n    for x in nums[1:]:\n        curr_max = max(x, curr_max + x)\n        max_so_far = max(max_so_far, curr_max)\n    print(max_so_far)\nif __name__ == '__main__': solve()`,
        },
        testCases: [
          { inputData: '9\n-2 1 -3 4 -1 2 1 -5 4', expectedOutput: '6', isHidden: false, weight: 15, orderIndex: 1 },
          { inputData: '1\n1', expectedOutput: '1', isHidden: false, weight: 15, orderIndex: 2 }
        ]
      }
    },
    {
      title: 'Vel Tech Coding Marathon 2026 (Online)',
      slug: 'vel-tech-coding-marathon-2026',
      description: 'A 24-hour coding marathon designed to test algorithmic endurance.',
      rules: 'Dynamic testcases execution. Submissions verified via worker queues.',
      status: 'UPCOMING',
      startTime: new Date('2026-10-05T09:00:00Z'),
      endTime: new Date('2026-10-06T09:00:00Z'),
      registrationDeadline: new Date('2026-10-04T18:00:00Z'),
      durationMinutes: 1440,
      prizePool: 'Smartwatch + Official Badges',
      visibility: 'PUBLIC',
      maxParticipants: 400,
      problem: {
        title: 'Coin Change',
        slug: 'coin-change',
        difficulty: 'MEDIUM',
        points: 30,
        statement: 'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount.',
        inputFormat: 'First line contains N and amount. Second line contains the N coin denominations.',
        outputFormat: 'Fewest coins needed, or -1 if amount cannot be met.',
        constraints: '1 <= coins.length <= 12, 0 <= amount <= 10^4',
        starterCode: {
          javascript: `function solve() {\n  const lines = readlines();\n  if (lines.length < 2) return;\n  const [n, amount] = lines[0].trim().split(/\\s+/).map(Number);\n  const coins = lines[1].trim().split(/\\s+/).map(Number);\n  const dp = Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let coin of coins) {\n    for (let i = coin; i <= amount; i++) {\n      dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n    }\n  }\n  console.log(dp[amount] === Infinity ? -1 : dp[amount]);\n}\nsolve();`,
          python: `import sys\ndef solve():\n    lines = sys.stdin.read().strip().split('\\n')\n    if len(lines) < 2: return\n    n, amount = map(int, lines[0].split())\n    coins = list(map(int, lines[1].split()))\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for coin in coins:\n        for i in range(coin, amount + 1):\n            dp[i] = min(dp[i], dp[i - coin] + 1)\n    print(dp[amount] if dp[amount] != float('inf') else -1)\nif __name__ == '__main__': solve()`,
        },
        testCases: [
          { inputData: '3 11\n1 2 5', expectedOutput: '3', isHidden: false, weight: 15, orderIndex: 1 },
          { inputData: '1 3\n2', expectedOutput: '-1', isHidden: false, weight: 15, orderIndex: 2 }
        ]
      }
    },
    {
      title: 'Vel Tech ACM Winter Hackathon Warmup (Online)',
      slug: 'vel-tech-acm-winter-hackathon-warmup',
      description: 'Prepare for the grand ACM Winter Hackathon with this dynamic warm-up contest.',
      rules: 'Standard dynamic locks and rate-limiting enabled.',
      status: 'UPCOMING',
      startTime: new Date('2026-11-20T10:00:00Z'),
      endTime: new Date('2026-11-20T13:00:00Z'),
      registrationDeadline: new Date('2026-11-20T09:00:00Z'),
      durationMinutes: 180,
      prizePool: 'Free passes to ACM winter conference',
      visibility: 'PUBLIC',
      maxParticipants: 250,
      problem: {
        title: 'Jump Game',
        slug: 'jump-game',
        difficulty: 'MEDIUM',
        points: 30,
        statement: 'You are given an integer array nums. You are initially positioned at the first index, and each element in the array represents your maximum jump length at that position. Return true if you can reach the last index, or false otherwise.',
        inputFormat: 'First line contains N. Second line contains the array elements.',
        outputFormat: 'Return "true" or "false".',
        constraints: '1 <= nums.length <= 10^4',
        starterCode: {
          javascript: `function solve() {\n  const lines = readlines();\n  if (lines.length < 2) return;\n  const nums = lines[1].trim().split(/\\s+/).map(Number);\n  let maxReach = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (i > maxReach) {\n      console.log("false");\n      return;\n    }\n    maxReach = Math.max(maxReach, i + nums[i]);\n  }\n  console.log("true");\n}\nsolve();`,
          python: `import sys\ndef solve():\n    lines = sys.stdin.read().strip().split('\\n')\n    if len(lines) < 2: return\n    nums = list(map(int, lines[1].split()))\n    max_reach = 0\n    for i, x in enumerate(nums):\n        if i > max_reach:\n            print("false")\n            return\n        max_reach = max(max_reach, i + x)\n    print("true")\nif __name__ == '__main__': solve()`,
        },
        testCases: [
          { inputData: '5\n2 3 1 1 4', expectedOutput: 'true', isHidden: false, weight: 15, orderIndex: 1 },
          { inputData: '5\n3 2 1 0 4', expectedOutput: 'false', isHidden: false, weight: 15, orderIndex: 2 }
        ]
      }
    },
    {
      title: 'Vel Tech Annual Coding Championship (Offline Round)',
      slug: 'vel-tech-annual-coding-championship-offline',
      description: 'The pinnacle of collegiate competitive programming at Vel Tech. Main Seminar Hall.',
      rules: 'Chapter officers will monitor systems live. Multiple-device logins are prohibited.',
      status: 'UPCOMING',
      startTime: new Date('2026-12-10T09:30:00Z'),
      endTime: new Date('2026-12-10T12:30:00Z'),
      registrationDeadline: new Date('2026-12-10T08:30:00Z'),
      durationMinutes: 180,
      prizePool: 'Gold Cup Trophy + ₹15,000',
      visibility: 'PUBLIC',
      maxParticipants: 100,
      problem: {
        title: 'Longest Substring Without Repeating Characters',
        slug: 'longest-substring-without-repeating',
        difficulty: 'MEDIUM',
        points: 30,
        statement: 'Given a string s, find the length of the longest substring without repeating characters.',
        inputFormat: 'A string s.',
        outputFormat: 'Integer value.',
        constraints: '0 <= s.length <= 5 * 10^4',
        starterCode: {
          javascript: `function solve() {\n  const s = readline().trim();\n  let maxLen = 0;\n  let start = 0;\n  const map = new Map();\n  for (let i = 0; i < s.length; i++) {\n    if (map.has(s[i])) {\n      start = Math.max(start, map.get(s[i]) + 1);\n    }\n    map.set(s[i], i);\n    maxLen = Math.max(maxLen, i - start + 1);\n  }\n  console.log(maxLen);\n}\nsolve();`,
          python: `import sys\ndef solve():\n    s = sys.stdin.read().strip()\n    max_len = 0\n    start = 0\n    seen = {}\n    for i, c in enumerate(s):\n        if c in seen:\n            start = max(start, seen[c] + 1)\n        seen[c] = i\n        max_len = max(max_len, i - start + 1)\n    print(max_len)\nif __name__ == '__main__': solve()`,
        },
        testCases: [
          { inputData: 'abcabcbb', expectedOutput: '3', isHidden: false, weight: 15, orderIndex: 1 },
          { inputData: 'bbbbb', expectedOutput: '1', isHidden: false, weight: 15, orderIndex: 2 }
        ]
      }
    },
    {
      title: 'Vel Tech Placement BootCamp Mock Contest (Online)',
      slug: 'vel-tech-placement-bootcamp-mock',
      description: 'Simulated technical assessment round to practice for product-based company selections.',
      rules: 'Standard online placement metrics.',
      status: 'UPCOMING',
      startTime: new Date('2027-01-05T15:00:00Z'),
      endTime: new Date('2027-01-05T17:00:00Z'),
      registrationDeadline: new Date('2027-01-05T14:00:00Z'),
      durationMinutes: 120,
      prizePool: 'ACM Placement Prep Kit + Reference books',
      visibility: 'PUBLIC',
      maxParticipants: 350,
      problem: {
        title: 'Three Sum',
        slug: 'three-sum-indices',
        difficulty: 'MEDIUM',
        points: 30,
        statement: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.',
        inputFormat: 'First line contains N. Second line contains N space-separated integers.',
        outputFormat: 'Print each triplet sorted on a new line.',
        constraints: '3 <= nums.length <= 3000',
        starterCode: {
          javascript: `function solve() {\n  const lines = readlines();\n  if (lines.length < 2) return;\n  const nums = lines[1].trim().split(/\\s+/).map(Number).sort((a,b) => a-b);\n  const res = [];\n  for (let i = 0; i < nums.length - 2; i++) {\n    if (i > 0 && nums[i] === nums[i - 1]) continue;\n    let l = i + 1, r = nums.length - 1;\n    while (l < r) {\n      const sum = nums[i] + nums[l] + nums[r];\n      if (sum === 0) {\n        res.push(\`\${nums[i]} \${nums[l]} \${nums[r]}\`);\n        while (l < r && nums[l] === nums[l + 1]) l++;\n        while (l < r && nums[r] === nums[r - 1]) r--;\n        l++; r--;\n      } else if (sum < 0) {\n        l++;\n      } else {\n        r--;\n      }\n    }\n  }\n  res.forEach(t => console.log(t));\n}\nsolve();`,
          python: `import sys\ndef solve():\n    lines = sys.stdin.read().strip().split('\\n')\n    if len(lines) < 2: return\n    nums = sorted(list(map(int, lines[1].split())))\n    res = []\n    for i in range(len(nums) - 2):\n        if i > 0 and nums[i] == nums[i - 1]: continue\n        l, r = i + 1, len(nums) - 1\n        while l < r:\n            s = nums[i] + nums[l] + nums[r]\n            if s == 0:\n                res.append(f"{nums[i]} {nums[l]} {nums[r]}")\n                while l < r and nums[l] == nums[l + 1]: l += 1\n                while l < r and nums[r] == nums[r - 1]: r -= 1\n                l += 1; r -= 1\n            elif s < 0:\n                l += 1\n            else:\n                r -= 1\n    for t in res: print(t)\nif __name__ == '__main__': solve()`,
        },
        testCases: [
          { inputData: '6\n-1 0 1 2 -1 -4', expectedOutput: '-1 -1 2\n-1 0 1', isHidden: false, weight: 15, orderIndex: 1 },
          { inputData: '3\n0 1 1', expectedOutput: '', isHidden: false, weight: 15, orderIndex: 2 }
        ]
      }
    },
    {
      title: 'Vel Tech New Year ACM Algorithmic Clash',
      slug: 'vel-tech-new-year-acm-clash',
      description: 'Ring in the New Year with a heavy programming clash hosted online by the Student Chapter.',
      rules: 'Dynamic contest environment with VM verification.',
      status: 'UPCOMING',
      startTime: new Date('2027-01-20T10:00:00Z'),
      endTime: new Date('2027-01-20T13:00:00Z'),
      registrationDeadline: new Date('2027-01-20T09:00:00Z'),
      durationMinutes: 180,
      prizePool: '₹8,000 + Placement referrals',
      visibility: 'PUBLIC',
      maxParticipants: 450,
      problem: {
        title: 'Number of Islands',
        slug: 'number-of-islands',
        difficulty: 'HARD',
        points: 50,
        statement: 'Given an m x n 2D binary grid which represents a map of \'1\'s (land) and \'0\'s (water), return the number of islands.',
        inputFormat: 'First line contains M and N. Next M lines contain N numbers representing the grid row.',
        outputFormat: 'Total island count.',
        constraints: '1 <= m, n <= 300',
        starterCode: {
          javascript: `function solve() {\n  const lines = readlines();\n  if (!lines.length) return;\n  const [m, n] = lines[0].trim().split(/\\s+/).map(Number);\n  const grid = [];\n  for (let i = 1; i <= m; i++) {\n    grid.push(lines[i].trim().split(/\\s+/));\n  }\n  let count = 0;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r+1, c);\n    dfs(r-1, c);\n    dfs(r, c+1);\n    dfs(r, c-1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  console.log(count);\n}\nsolve();`,
          python: `import sys\nsys.setrecursionlimit(2000)\ndef solve():\n    lines = sys.stdin.read().strip().split('\\n')\n    if not lines or len(lines) < 2: return\n    m, n = map(int, lines[0].split())\n    grid = [lines[i].split() for i in range(1, m + 1)]\n    count = 0\n    def dfs(r, c):\n        if r < 0 or r >= m or c < 0 or c >= n or grid[r][c] != '1': return\n        grid[r][c] = '0'\n        dfs(r+1, c)\n        dfs(r-1, c)\n        dfs(r, c+1)\n        dfs(r, c-1)\n    for r in range(m):\n        for c in range(n):\n            if grid[r][c] == '1':\n                count += 1\n                dfs(r, c)\n    print(count)\nif __name__ == '__main__': solve()`,
        },
        testCases: [
          { inputData: '4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0', expectedOutput: '1', isHidden: false, weight: 25, orderIndex: 1 },
          { inputData: '4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1', expectedOutput: '3', isHidden: false, weight: 25, orderIndex: 2 }
        ]
      }
    }
  ];

  for (const cData of baseContestsData as any[]) {
    const contest = await db.contest.upsert({
      where: { slug: cData.slug },
      update: {
        status: cData.status,
        startTime: cData.startTime,
        endTime: cData.endTime,
        registrationDeadline: cData.registrationDeadline,
      },
      create: {
        title: cData.title,
        slug: cData.slug,
        description: cData.description,
        rules: cData.rules,
        status: cData.status,
        startTime: cData.startTime,
        endTime: cData.endTime,
        registrationDeadline: cData.registrationDeadline,
        durationMinutes: cData.durationMinutes,
        prizePool: cData.prizePool,
        visibility: cData.visibility,
        maxParticipants: cData.maxParticipants,
        scoring: 'STANDARD',
        penaltyRules: 20,
        chapterId: chapter.id,
        creatorId: creator.id,
      },
    });

    const prob = await db.problem.upsert({
      where: { contestId_slug: { contestId: contest.id, slug: cData.problem.slug } },
      update: { points: cData.problem.points },
      create: {
        contestId: contest.id,
        title: cData.problem.title,
        slug: cData.problem.slug,
        orderIndex: 1,
        difficulty: cData.problem.difficulty,
        tags: cData.problem.tags || 'Algorithms',
        points: cData.problem.points,
        statement: cData.problem.statement,
        inputFormat: cData.problem.inputFormat,
        outputFormat: cData.problem.outputFormat,
        constraints: cData.problem.constraints,
        starterCode: JSON.stringify(cData.problem.starterCode),
        testCases: {
          create: cData.problem.testCases,
        },
      },
    });

    console.log(`✅ Seeded Contest: "${contest.title}" with problem: "${prob.title}"`);
  }

  console.log('🎉 Seeding of 10 ACM Contests Completed Successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
