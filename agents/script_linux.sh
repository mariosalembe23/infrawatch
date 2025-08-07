#!/bin/sh

# This script is used to install the Infra-Watch agent.
# ORDER: create, install, recreate, remove

FILE=$1
ORDER=$2

if [ -z "$FILE" -o -z "$ORDER" ]; then
    echo "Usage: $0 <file> <order>"
    exit 1
fi

if [ "$ORDER" = "create" ]; then
    echo "Creating Infra-Watch agent..."
    pyinstaller --onefile --icon=infra.ico --windowed --name infra-watch "$FILE"
elif [ "$ORDER" = "remove" ]; then
    echo "Removing Infra-Watch agent..."
    rm -rf dist
    rm -rf build
    rm -f infra-watch.spec
else
    echo "Invalid order: $ORDER"
    exit 1
fi
