# Online Judge API Documentation

Detailed endpoints for submission queuing, sandbox execution, administrative contest/problem setup, and real-time standings.

---

## 1. Public Student & Arena APIs

### 1.1 Run Sample Input
* **Route**: `POST /api/contests/run`
* **Request**:
  ```json
  {
    "language": "javascript",
    "code": "console.log(readline());",
    "input": "4 9\n2 7 11 15"
  }
  ```
* **Response**:
  ```json
  {
    "success": true,
    "result": {
      "status": "ACCEPTED",
      "stdout": "4 9\n2 7 11 15",
      "stderr": "",
      "executionTimeMs": 1,
      "memoryUsedMb": 1.5
    }
  }
  ```

### 1.2 Submit Code (Queued)
* **Route**: `POST /api/contests/submit`
* **Request**:
  ```json
  {
    "contestId": "uuid-here",
    "problemId": "uuid-here",
    "language": "javascript",
    "code": "..."
  }
  ```
* **Response**:
  ```json
  {
    "success": true,
    "message": "Submission queued successfully",
    "submission": {
      "id": "sub-uuid",
      "status": "QUEUED"
    }
  }
  ```

### 1.3 Poll Submission Result
* **Route**: `GET /api/submissions/[id]`
* **Response**:
  ```json
  {
    "success": true,
    "submission": {
      "id": "sub-uuid",
      "status": "ACCEPTED",
      "score": 100,
      "executionTimeMs": 15,
      "memoryUsedMb": 12.3,
      "testResults": [
        {
          "status": "ACCEPTED",
          "executionTimeMs": 12,
          "score": 50,
          "testCase": {
            "orderIndex": 1,
            "isHidden": false,
            "inputData": "4 9...",
            "expectedOutput": "0 1"
          }
        }
      ]
    }
  }
  ```
  *(Note: Hidden testcases omit their `inputData` and `expectedOutput` in the response to students).*

---

## 2. Anti-Cheating Telemetry Logging

* **Route**: `POST /api/contests/activity-log`
* **Request**:
  ```json
  {
    "contestId": "uuid-here",
    "type": "TAB_BLUR",
    "details": "User navigated away from the coding tab or switched focus at 11:32:15 AM"
  }
  ```
