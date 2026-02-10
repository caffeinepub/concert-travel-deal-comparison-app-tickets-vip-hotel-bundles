# Specification

## Summary
**Goal:** Let users compare total trip costs across multiple transport modes and automatically flag + save “better-value upgrades” (higher quality but cheaper) alongside the user’s planned baseline choices.

**Planned changes:**
- Extend saved TripComparison data to persist the user’s planned (baseline) selections (ticket, optional VIP, hotel+room, and transport if provided) and also persist auto-flagged better-value upgrade alternatives (tickets, transport options, hotel rooms), while remaining compatible with previously saved comparisons.
- Update the Trip Builder flow to allow adding/editing/removing transportation offers (at minimum plane, train, and taxi/ground), including mode, provider/name, class/comfort label, price, and currency.
- Update comparison/results logic to include transport cost in total bundle cost when provided and identify the cheapest transport option (with currency matching).
- Implement deterministic local upgrade detection (from user-entered offers only) that flags alternatives as “better-value upgrades” when they are cheaper than the user’s planned choice and higher quality based on entered labels/star rating/room label.
- Update Save Comparison and saved-comparisons (CostCompass) UI to store and display the baseline planned choices plus a summary/count (or short list) of auto-saved flagged upgrades by category, and ensure delete removes all associated metadata.
- Ensure all new/modified user-facing copy for transport, planned choice, and upgrades is clear English.

**User-visible outcome:** Users can enter and compare multiple transport modes as part of a trip, select their planned baseline options, see cheaper higher-quality upgrades flagged in results, and save comparisons that include both their baseline choices and the auto-saved flagged upgrades for later viewing.
