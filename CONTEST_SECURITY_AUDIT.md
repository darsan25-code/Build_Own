# Security Audit & Guardrails Report

Security overview of the Online Judge system and client-side anti-cheating controls.

---

## 1. Thread Safety & Main Process Isolation

Untrusted user code is **never** executed inside the main Next.js thread. Spawning executions inside API routes or server actions is disabled to protect against:
- **Server Denial of Service (DoS)**: A user submitting `while(true) {}` cannot block the Next.js event loop.
- **Resource Starvation**: Subprocess spawn concurrency is strictly regulated by the background worker queue.

## 2. Server-Controlled Contest State Guards

Timings are validated exclusively using NTP-synchronized backend server clocks.
- The server validates:
  ```typescript
  const now = new Date();
  if (now < contest.startTime || now > contest.endTime) {
    throw new Error("Contest is not currently live");
  }
  ```
- Mutating the local browser clock does **not** bypass these checks, as submissions outside the database-defined window are rejected.

## 3. Rate-Limiting & Upload Restraints
- **Source Code Restraint**: Submissions are strictly limited to `100KB` to prevent buffer overflows or memory exhaustion.
- **Hidden Test Case Obfuscation**: The database filters out input/output details for testcases marked `isHidden: true` before sending API responses.

## 4. Anti-Cheating Telemetry Logging
- Captures client-side window focus switches (`TAB_BLUR`) and clipboard actions (`COPY_PASTE`).
- Detections are logged to the database for administrative review, preventing automatic disqualifications from false positives.
