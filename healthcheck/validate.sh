#!/bin/bash
# Unix/Linux shell script to run webpage validation
# Usage: ./validate.sh [url]

if [ -z "$1" ]; then
    echo "Running validation with default URL..."
    node "$(dirname "$0")/validate-webpage.js"
else
    echo "Running validation for $1"
    TARGET_URL="$1" node "$(dirname "$0")/validate-webpage.js"
fi
