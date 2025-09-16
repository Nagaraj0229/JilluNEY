#!/bin/bash

# Fix The Prettier First
npm run prettier-format

# Add all changes
git add .

# Prompt user for commit message
echo "Enter commit message: "
read commit_message

# Commit changes
git commit -m "$commit_message"

# Get the current branch name
current_branch=$(git rev-parse --abbrev-ref HEAD)

# Check if the branch is already tracked remotely
if git rev-parse --verify --quiet "origin/$current_branch"; then
    echo "Pushing to existing remote branch: $current_branch"
    git push origin "$current_branch"
else
    echo "New branch detected. Pushing and setting upstream: $current_branch"
    git push --set-upstream origin "$current_branch"
fi
