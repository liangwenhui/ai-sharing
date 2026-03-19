#!/usr/bin/env python3

import argparse
import json
import os
import pty
import selectors
import signal
import struct
import subprocess
import sys
import termios
import fcntl


def emit(message):
    sys.stdout.write(json.dumps(message) + "\n")
    sys.stdout.flush()


def set_winsize(fd, rows, cols):
    packed = struct.pack("HHHH", rows, cols, 0, 0)
    fcntl.ioctl(fd, termios.TIOCSWINSZ, packed)


def terminate_process_group(process):
    if process.poll() is not None:
        return

    os.killpg(process.pid, signal.SIGTERM)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--cwd", required=True)
    parser.add_argument("--shell", required=True)
    parser.add_argument("--shell-arg", action="append", default=[])
    parser.add_argument("--cols", type=int, default=120)
    parser.add_argument("--rows", type=int, default=32)
    args = parser.parse_args()

    master_fd, slave_fd = pty.openpty()
    set_winsize(slave_fd, args.rows, args.cols)

    process = subprocess.Popen(
        [args.shell, *args.shell_arg],
        cwd=args.cwd,
        stdin=slave_fd,
        stdout=slave_fd,
        stderr=slave_fd,
        start_new_session=True,
        close_fds=True,
    )

    os.close(slave_fd)

    selector = selectors.DefaultSelector()
    selector.register(master_fd, selectors.EVENT_READ)
    selector.register(sys.stdin, selectors.EVENT_READ)

    emit({"type": "status", "status": "ready"})

    try:
        while True:
            if process.poll() is not None:
                break

            for key, _ in selector.select(timeout=0.1):
                if key.fileobj == master_fd:
                    try:
                        chunk = os.read(master_fd, 4096)
                    except OSError:
                        chunk = b""

                    if not chunk:
                        break

                    emit({
                        "type": "output",
                        "data": chunk.decode("utf-8", errors="replace")
                    })
                    continue

                line = sys.stdin.readline()
                if not line:
                    terminate_process_group(process)
                    break

                message = json.loads(line)

                if message["type"] == "input":
                    os.write(master_fd, message["data"].encode("utf-8"))
                elif message["type"] == "resize":
                    set_winsize(master_fd, int(message["rows"]), int(message["cols"]))
                elif message["type"] == "shutdown":
                    terminate_process_group(process)
                    break
    finally:
        try:
            selector.unregister(master_fd)
        except Exception:
            pass

        try:
            selector.unregister(sys.stdin)
        except Exception:
            pass

        if process.poll() is None:
            terminate_process_group(process)
            try:
                process.wait(timeout=1)
            except subprocess.TimeoutExpired:
                os.killpg(process.pid, signal.SIGKILL)

        try:
            os.close(master_fd)
        except OSError:
            pass

        emit({"type": "status", "status": "closed"})


if __name__ == "__main__":
    main()
