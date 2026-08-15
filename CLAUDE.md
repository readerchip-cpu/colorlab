전체 현황 한 장은 @docs/CONTEXT.md 참고.

## 부서 라우팅 (먼저 읽을 것)

컬러랩 = AI 퍼스널컬러 진단(₩4,900 단건, MZ 여성). 요청을 받으면 **부서를 먼저 판별하고 그 부서 파일만 읽는다.**

| 부서 | 파일 | 이런 요청일 때 |
|---|---|---|
| 마케팅 | `docs/부서/마케팅.md` | 바이럴 테스트, 획득, 가격, 전환, 성과 측정 |
| 개발 | `docs/부서/개발.md` | 코드, 결제(PortOne·PayPal), Supabase, 계측, 버그 |
| 콘텐츠 | `docs/부서/콘텐츠.md` | 숏폼 소재, 카피, 비주얼, 랜딩 문구, 메시징 |

- 작업이 끝나면 **그 부서 파일을 갱신한다**(최종 수정일 포함). `/handoff` 실행 시 커밋·푸시.
- 보고서는 **바탕화면이 아니라** `docs/리포트/`에 저장하고 Artifact로 게시해 링크를 README 표에 추가한다.

---

# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
