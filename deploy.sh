#!/usr/bin/bash

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Git deployment script for TurnMeUpCno
deploy_to_github() {
    # Ensure the user is on the master branch before deploying
    current_branch=$(git rev-parse --abbrev-ref HEAD)
    
    if [ "$current_branch" != "master" ]; then
        echo -e "${YELLOW}Switching to master branch...${NC}"
        git checkout master 2>/dev/null || git checkout -b master
    fi

    # Add all changes
    git add .

    # Prompt for commit message
    read -p "Enter commit message: " commit_message

    # Commit changes
    git commit -m "$commit_message"

    # Push to master branch
    git push origin master
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to push to master. Check your Git configuration.${NC}"
        exit 1
    fi

    echo -e "${GREEN}master branch updated successfully.${NC}"

    # Check if gh-pages branch exists
    if git show-ref --quiet refs/heads/gh-pages; then
        echo -e "${GREEN}gh-pages branch exists. Updating...${NC}"
        git checkout gh-pages
        git merge master --no-edit
    else
        echo -e "${YELLOW}gh-pages branch does not exist. Creating it...${NC}"
        git checkout -b gh-pages
        git merge master --no-edit
    fi

    # Push to gh-pages branch
    git push origin gh-pages
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Deployment to gh-pages successful!${NC}"
    else
        echo -e "${RED}Failed to deploy to gh-pages.${NC}"
    fi

    # Switch back to master branch
    git checkout master
}

# Run deployment function
deploy_to_github