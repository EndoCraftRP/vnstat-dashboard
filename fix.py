# Ah... look at `Reports.tsx`:
# `const type = tab ?? settings.reports_initial;`
# `<Tabs value={type} onValueChange={(val: any) => setTab(val)}>`
# The `Tabs` component wraps `TabsList`, but NOT the content! It doesn't have any `TabsContent`. It just uses `type` to render `<Cards type={type} traffic={traffic} />`. This is fine.

# Look at `ChartView.tsx`:
# `let type: ReportsContextTab = tab ?? settings.chart_initial;`
# `<Tabs value={type} onValueChange={(val: any) => setTab(val)}>`
# It wraps `TabsList` AND `TabsContent`.

# Wait... the user said: "when I click on any button, for example (Minutes, Hours or Days) i don't have any change of background (the btn UI state is unselected)"
# Wait, look at `ChartView.tsx`:
# `let type: ReportsContextTab = tab ?? settings.chart_initial;`
# What if `type` in `ChartView` is updated, but because `tab` is shared in `ReportsContext`, the `Reports` component is ALSO updated?
# Yes, they share the SAME context.
# In `Reports.tsx`, the menu has "top", "fiveminute", "hour", "day", "month", "year".
# If I click "hour" in `ChartView`, `setTab("hour")` happens. `Reports` updates its `Tabs` to `value="hour"`.
# What if I click "top" in `Reports`?
# `setTab("top")` happens. `Reports` updates to `"top"`.
# `ChartView` gets `tab = "top"`.
# In `ChartView`:
# `let type = tab ?? settings.chart_initial;` -> `type` is `"top"`.
# `const exists = menu.findIndex((el) => el.type === type);` -> `exists` is `-1` because `ChartView` menu doesn't have `"top"`.
# `if (exists === -1) type = lastType.current ?? "fiveminute";`
# `type` becomes `"fiveminute"`.
# `ChartViewRender` receives `type="fiveminute"`.
# Wait! If `type` is `"fiveminute"`, `ChartView` renders `<Tabs value="fiveminute">`. So the "Minutes" tab gets selected!
# But wait, what if `tab` is "fiveminute"?
# It works perfectly.

# What if `Reports` sets `tab` to something else? No, the bug is "when I click on any button... I don't have any change of background".
# Let's check `Chart.tsx` again.
# Wait! In `Chart.tsx` I added:
# `<Tabs defaultValue="traffic" className="w-full">`
# `<TabsList>`
# `<TabsTrigger value="traffic">Traffic Data</TabsTrigger>`
# `<TabsTrigger value="rate">Mbit/s Rate</TabsTrigger>`
# `</TabsList>`
# Is it possible that the user is talking about THESE buttons? "Traffic Data" and "Mbit/s Rate"?
# No, the user explicitly said: "for example (Minutes, Hours or Days)". Those are the main tabs in `ChartView` and `Reports`.

# Let's reconsider Tailwind CSS.
# `src/components/ui/tabs.tsx`:
# `data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow`
# These are standard Tailwind classes.
# Is it possible that the state active is not triggered?
# In Radix, `Tabs` uses `value` prop. If `value` prop does not strictly equal the `value` of `TabsTrigger`, it won't be active.
# What is the value passed to `TabsTrigger`?
# `value={item.type}` -> `"fiveminute"`, `"hour"`, etc.
# What is the value passed to `Tabs`?
# `value={type}` -> `"fiveminute"`, `"hour"`, etc.
# They are strictly equal.
