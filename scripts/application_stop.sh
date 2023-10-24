#!/bin/bash

PIDS=$(pgrep -f "node app.js")

if [ ! -z "$PIDS" ]; then
    echo "Killing existing processes..."
    echo $PIDS | xargs sudo kill
else
    echo "No processes found to kill."
fi

#pgrep -d -l -f "node app.js" | sudo xargs kill
