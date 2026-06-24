#!/bin/bash
# Daemon launcher — double-forks to orphan the process to PID 1 (init),
# so it survives the parent bash shell being killed.
cd /home/z/my-project

# Kill any existing next process
pkill -f "next dev" 2>/dev/null
sleep 1

# Double-fork daemonization
(
  # First fork — child runs in subshell
  setsid bash -c '
    cd /home/z/my-project
    # Second fork — exec replaces this process
    exec ./node_modules/.bin/next dev -p 3000
  ' </dev/null >>/home/z/my-project/dev.log 2>&1 &
  # First-fork parent exits immediately
  exit 0
)
# Outer shell exits, orphaning the grandchild to init

# Wait briefly and report
sleep 1
echo "daemon launched"
