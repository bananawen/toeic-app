# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-03-04

### Added
- Part 2, 5, 6, 7 question support
- Per-question timer (Part 2: 8s, Part 5: 25s, Part 6: 45s, Part 7: 60s)
- Question set timer for Part 6 & 7 (same passage = same timer)
- Timer color by percentage (>50% blue, 20-50% orange, <20% red)
- Question count selector modal (5/10/15/20)
- New homepage layout: Parts 1-7 in order
- Collapsible category practice under Part 5
- Random quiz feature (select multiple types)
- Mock exam (100 questions)
- Swipeable passages for Part 7
- Larger text and passage area for Part 6/7
- Compact header design

### Fixed
- Part 6 & 7 question format (multiple questions per passage)
- Duplicate key errors
- Answer state not clearing between questions
- Passage scroll behavior

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
