# Codex Live Terminal Design

## Goal
Add a live terminal demo to the presentation so a local presenter can open a browser modal, interact with a real shell, and manually launch `codex` from the repository root.

## Approved Approach
Use the existing Vite presentation as the front end and add a local Node bridge server. The UI will open a modal that renders an `xterm.js` terminal. A WebSocket connection will proxy browser input/output to a PTY-backed shell running on the presenter machine.

## Interaction Model
- The deck keeps its existing single-page flow.
- A `Live Codex Demo` trigger opens a dedicated terminal modal.
- Each modal open creates one fresh shell session rooted at the repository root.
- Closing the modal, reloading the page, or dropping the WebSocket ends that shell session.
- The terminal starts in a real shell; the presenter manually runs `codex`.

## Boundaries
- Only one live shell session is supported per browser tab.
- No command allowlist or session persistence is added in this iteration.
- The bridge is for local presentation use, not for remote multi-user access.

## Failure Handling
- WebSocket connection failures surface a clear UI state and allow retry.
- Terminal resize events update PTY rows and columns.
- Missing local CLI tools are shown by the real shell output.
