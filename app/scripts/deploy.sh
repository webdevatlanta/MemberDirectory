# If an error occurs, exit.
trap 'exit' ERR

# Ensure that a gh-pages branch exists
if ! [ `git rev-parse --quiet --verify gh-pages` ]
then
  echo
  echo "No local gh-pages branch found. Attempting to fetch from remote..."
  if ! [ `git fetch origin gh-pages:gh-pages` ]
  then
    # Provide instructions for creating a gh-pages branch.
    TOP_LEVEL=`git rev-parse --show-toplevel`
    HEAD=`git rev-parse --abbrev-ref HEAD`
    echo "You'll need to create a gh-pages branch before continuing."
    echo "1) git checkout --orphan gh-pages"
    echo "2) cd $TOP_LEVEL"
    echo "3) git rm -rf ."
    echo "4) git commit --allow-empty -m 'Initial commit of gh-pages branch.'"
    echo "5) git push origin gh-pages"
    echo "5) git checkout $HEAD"
    echo "6) ... and try deploying again."
    echo
    exit
  fi
fi

# Connect the origin/gh-pages branch to a folder of the same name.
git worktree add gh-pages origin/gh-pages

# Remove everything in there.
(cd gh-pages && git rm -r *)

# Move everything back (including new stuff, if available).
cp -R build/ gh-pages/

# Commit and push the contents.
(cd gh-pages && git add . && git commit -m "Deploy." && git push origin HEAD:gh-pages)

# Then clean up (unmount) the gh-pages worktree.
git worktree remove gh-pages
