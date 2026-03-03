# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-03-03

### Added
- TOEIC quiz app MVP
- Three quiz modes: vocabulary, grammar, full mock exam
- Horizontal timer bar (blue → orange → red)
- Auto-advance to next question (400ms delay)
- Results page with explanations
- Track long-think questions (>30 seconds ⚠️)
- Exit confirmation dialog
- Progress preserved on page refresh (localStorage)
- My Notebook feature (add/delete/browse words)
- Add to notebook via ♡ button on options
- Auto-fetch word definitions from Dictionary API
- Add word modal with edit button (read-only by default)
- Show part of speech, examples, synonyms
- Tap to add word in question (clickable words)
- Git version control
- GitHub repository: https://github.com/bananawen/toeic-app

### Fixed
- Hydration errors (using fixed seed for random)
- Compilation errors

### Technical
- Next.js 15 + TypeScript + Tailwind CSS + Shadcn UI
- localStorage for data persistence
