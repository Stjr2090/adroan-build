#!/usr/bin/env bash
# check-identity.sh — fail on personal names, agent identities, disallowed
# dev-tool/model mentions, contact details, or secret-shaped strings in
# tracked files, in unpushed commit messages, and (when provided via env)
# in a pull request's title and body.
# Matching is whole-word and case-insensitive. Approved terms are listed
# one per line in identity-allowlist.txt; a match whose text contains an
# allowlisted term as an exact substring is exempt.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"
ALLOW_FILE=identity-allowlist.txt
COMMIT_ALLOW_FILE=identity-commit-allowlist.txt
if [ ! -f "$ALLOW_FILE" ]; then
  echo "check-identity: $ALLOW_FILE missing" >&2
  exit 1
fi

shopt -s nocasematch

# One ERE: blocklisted names (word-bounded), IDs, emails, secret shapes.
PAT='\b(Fo|Stephen|Tumusiime|Stjr2090|Musiime|Musiime-1|M-1|Jagent|Think|think-1|Wajo|Obbo|obbo-back|Agent-X|R-1|R-2|OCI-H1|Wabi|Pally|Hermes|OpenClaw|opencode|InstaBox|open-vin|Townie|MiniMax|DeepSeek|Kimi|GLM)\b|[0-9]{17,20}|[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+|ntn_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9_-]{20,}|ghp_[A-Za-z0-9]{20,}|xox[bap]-[A-Za-z0-9-]{10,}|[0-9a-f]{32}'
# The scanner's own source legitimately contains the blocklist;
# the allowlist file may name allowed terms only.
SCAN_PATHS=(-- . ':(exclude)scripts/check-identity.sh' ':(exclude)identity-commit-allowlist.txt')

violate() {
  local line="$1" term
  while IFS= read -r term; do
    case "$term" in ''|'#'*) continue ;; esac
    line=${line//"$term"/}
  done < "$ALLOW_FILE"
  [[ "$line" =~ $PAT ]]
}

# Commit-message-only exemptions: stripped before matching, never applied
# to tracked files, PR titles or PR bodies. File is optional.
strip_commit_allow() {
  local line="$1" term
  if [ -f "$COMMIT_ALLOW_FILE" ]; then
    while IFS= read -r term; do
      case "$term" in ''|'#'*) continue ;; esac
      line=${line//"$term"/}
    done < "$COMMIT_ALLOW_FILE"
  fi
  printf '%s' "$line"
}

flag() {
  echo "BLOCKED: identity/secret pattern in $1"
  echo "  term: $2"
}

fail=0
raw=$(git grep -i -n -I -E "$PAT" "${SCAN_PATHS[@]}" 2>/dev/null || true)
if [ -n "$raw" ]; then
  while IFS= read -r hit; do
    file=${hit%%:*}
    rest=${hit#*:}
    num=${rest%%:*}
    text=${rest#*:}
    if violate "$text"; then
      flag "$file:$num (rules: identity-allowlist.txt)" "$text"
      fail=1
    fi
  done <<< "$raw"
fi

# A pull request's title and body when the caller provides them.
scan_env_text() {
  local label="$1" text="$2" line
  [ -n "$text" ] || return 0
  while IFS= read -r line; do
    if violate "$line"; then
      flag "$label" "$line"
      fail=1
    fi
  done <<< "$text"
}
scan_env_text "PR title (rules: identity-allowlist.txt)" "${SCAN_PR_TITLE:-}"
scan_env_text "PR body (rules: identity-allowlist.txt)" "${SCAN_PR_BODY:-}"

# Unpushed commit messages, relative to origin/main when it exists.
# With an argument (commit-msg hook), scan that message file instead.
if [ $# -ge 1 ]; then
  while IFS= read -r msg; do
    msg=$(strip_commit_allow "$msg")
    if violate "$msg"; then
      flag "commit message: $msg" "$msg"
      fail=1
    fi
  done < "$1"
elif git rev-parse --verify --quiet origin/main >/dev/null; then
  msgs=$(git log --format='%s%n%b' origin/main..HEAD 2>/dev/null || true)
  if [ -n "$msgs" ]; then
    while IFS= read -r msg; do
      # GitHub auto-generates "Merge <sha> into <sha>" for PR merge-ref
      # checkouts; the SHAs are not authored text, so exempt that exact
      # anchored shape when both tokens resolve to real commit objects.
      if [[ "$msg" =~ ^Merge\ ([0-9a-f]{40})\ into\ ([0-9a-f]{40})$ ]]; then
        if git cat-file -e "${BASH_REMATCH[1]}^{commit}" 2>/dev/null \
           && git cat-file -e "${BASH_REMATCH[2]}^{commit}" 2>/dev/null; then
          continue
        fi
      fi
      msg=$(strip_commit_allow "$msg")
      if violate "$msg"; then
        flag "commit message: $msg" "$msg"
        fail=1
      fi
    done <<< "$msgs"
  fi
fi

if [ "$fail" -ne 0 ]; then
  echo "check-identity: FAILED — remove the pattern or add an exact allowed term to $ALLOW_FILE" >&2
  exit 1
fi
echo "check-identity: clean"
