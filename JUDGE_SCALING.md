# Judge Worker Scaling & Backpressure Guidelines

Describes horizontal scaling configurations, backpressure rules, and worker pool sizing under spikes.

---

## 1. Asynchronous Queue Backpressure Sizing

- **Submission API**:
  - Immediately commits records as `QUEUED` and replies with a `202 Accepted` response.
  - Limits database write time to `< 15ms`, allowing the server to handle high submission volumes.

---

## 2. Horizontal Worker Pool Configuration

| Parameter | Configuration Value | Sizing Formula / Logic |
|:---|:---|:---|
| **`CONCURRENCY_LIMIT`** | `4` workers (local default) | Capped at `CPU Cores - 1` to prevent local thread lockups. |
| **`POLL_INTERVAL_MS`** | `1000ms` | Set to reduce loop overhead when the queue is empty. |
| **`VISIBILITY_TIMEOUT`** | `30 seconds` | Max timeout before a task is assumed crashed and retried by another worker. |

---

## 3. Worker Sizing Guidelines

When queue wait times increase:
- **Metrics Trigger**: Average queue wait time exceeds `5000ms`.
- **Scaling Action**: Provision additional sandbox execution instances.
- **Backpressure Response**: If the queue fills up, new runs are throttled while the server remains responsive.
