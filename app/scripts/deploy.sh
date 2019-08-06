# If an error occurs, exit.
trap 'exit' ERR

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
