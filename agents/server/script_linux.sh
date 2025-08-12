#!/bin/sh

# This script is used to install the Infra-Watch agent.
# ORDER: create, install, recreate, remove

FILE=$1
ORDER=$2
SCRIPT="cleaner.sh"

# Check if the file and order arguments are provided
if [ -z "$FILE" -o -z "$ORDER" ]; then
    echo "Usage: $0 <file> <order>"
    exit 1
fi

# Check if the cleaner.sh script exists
if [ ! -f "$SCRIPT" ]; then
    echo "Error: $SCRIPT not found."
    exit 1
fi

# Check if the specified file exists
if [ ! -f "$FILE" ]; then
    echo "Error: File $FILE not found."
    exit 1
fi

if [ "$ORDER" = "create" ]; then
    echo "Creating Infra-Watch agent..."
    sudo systemctl daemon-reload
    sudo systemctl restart infra_watch
    # Run the cleaner.sh script
    sh "$SCRIPT" || { echo "Failed to execute $SCRIPT"; exit 1; }
    
    # Build the Infra-Watch executable using PyInstaller
    pyinstaller --onefile --icon=infra.ico --name infra-watch --hidden-import=requests --add-data "monitor.py:." "$FILE" || { echo "PyInstaller failed"; exit 1; }
    
    echo "Infra-Watch agent created successfully."
    

elif [ "$ORDER" = "remove" ]; then
    echo "Removing Infra-Watch agent..."
    
    # Run the cleaner.sh script
    sh "$SCRIPT" || { echo "Failed to execute $SCRIPT"; exit 1; }
    
    # Clean up build directory and spec file
    rm -rf build || { echo "Failed to remove build directory"; exit 1; }
    rm -f infra-watch.spec || { echo "Failed to remove infra-watch.spec"; exit 1; }
    
    echo "Infra-Watch agent removed successfully."

else
    echo "Invalid order: $ORDER"
    exit 1
fi
