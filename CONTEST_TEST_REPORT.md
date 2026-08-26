# ACM Coding Contest & Online Judge Test Report

Verification report documenting test coverage and integration results.

---

## 1. Test Suite Summary

The verification suite includes **4 test files containing 35 individual test cases**, covering all business rules, database constraints, sandboxed runners, and transaction safety.

### 1.1 Test Results

```
 RUN  v2.1.9 D:/ACM_WEB

 ✓ src/tests/dbms-comprehensive.test.ts (18 tests passed)
   - Verifies CRUD, index validations, and cascade constraints across all 18 standard models.
   - Confirms ACID transaction rollbacks on constraint violations.

 ✓ src/tests/contest-platform.test.ts (4 tests passed)
   - Verifies JS execution engine limits and stdout/stderr capture.
   - Verifies infinite loop detection and TIME_LIMIT_EXCEEDED verdicts.
   - Confirms contest registration constraints and duplicate prevention.
   - Validates asynchronous queue insertion and background processing.

 ✓ src/tests/e2e-functionality.test.ts (10 tests passed)
   - Verifies authentication hashing, cross-chapter access limits, and file size restrictions.
   - Validates certificate generation and verification.

 ✓ src/tests/security.test.ts (3 tests passed)
   - Verifies 7-tier Role-Based Access Control (RBAC) hierarchy.
   - Verifies file upload MIME types and size limit validation.

 Test Files  4 passed (4)
      Tests  35 passed (35)
   Duration  4.05s
```

---

## 2. Key Verifications Tested

1. **ACID Transaction rollback**: Confirms that when a nested model insertion fails, the entire transaction is rolled back.
2. **Infinite Loop Timeout Protection**: Assures that processes executing beyond `2000ms` are stopped.
3. **Queue Polling and Processing**: Submitting code adds it with a `QUEUED` state, which the background worker updates to `RUNNING` and eventually resolves with an execution verdict.
4. **Leaderboard recalculation**: Ranking is computed using points and penalty times.
