# Performance Baseline & Latency SLA

Establishment of latency and resource baseline requirements under load.

---

## 1. Response Time Benchmarks (SLA Targets)

| Request Target | Target p50 | Target p95 | Target p99 | Max Fail Rate |
|:---|:---|:---|:---|:---:|
| **Public Catalog Pages** | `10ms` | `45ms` | `150ms` | `< 0.1%` |
| **API Code Runs** | `15ms` | `250ms` | `900ms` | `< 0.5%` |
| **Submission Queues** | `12ms` | `80ms` | `300ms` | `< 0.1%` |
| **Health Observability** | `2ms` | `10ms` | `50ms` | `< 0.0%` |

---

## 2. Resource Consumption Profiles

- **Web Server Instances**:
  - Memory: `~150MB` base, `~450MB` peak load.
  - CPU: `~5%` base, `~85%` load peaks.
- **Judge Daemon Execution Engine**:
  - CPU: Auto-scales to execute tests. Timeouts are terminated at 2000ms.
  - Memory: Capped at `256MB` heap limit per container.
