# Jade Frontend Design System

## Tech Stack

| Concern | Choice |
|---|---|
| UI Framework | React 18 + TypeScript |
| Component Library | MUI v6 (@mui/material) |
| Styling Engine | Emotion (@emotion/react, @emotion/styled) |
| Icons | lucide-react (tree-shakeable SVG icons) |
| Font | Inter (self-hosted via @fontsource/inter) |
| Routing | react-router-dom v6 |
| Server State | @tanstack/react-query v5 |
| Client State | Zustand v4 |
| HTTP | Axios |
| Auth | Supabase |

## Design Philosophy

**"Premium SaaS"** — Clean, warm, sophisticated. Inspired by Linear and Notion. No heavy shadows, no aggressive gradients. Uses thin borders, generous whitespace, and a warm off-white background to create a premium feel that avoids the "generic startup" look.

## Core Design Tokens

### Color Palette

```
 Background:    #F8F7F4  (warm off-white)
 Surface:       #FFFFFF
 Primary text:  #0F172A  (slate-900)
 Secondary text:#64748B  (slate-500)
 Border:        #E2E8F0  (slate-200)
 Accent:        #4F46E5  (indigo-600)
 Accent soft:   #EEF2FF  (indigo-50)
 Success:       #10B981  (emerald-500)
 Error:         #EF4444  (red-500)
 Warning:       #F59E0B  (amber-500)
```

### Typography

- **Font**: Inter (300, 400, 500, 600, 700 weights)
- **Headings**: 600-700 weight, tight letter-spacing on large sizes
- **Body**: 400 weight, `0.9375rem` size, 1.6 line-height
- **Small/caption**: `0.75rem` size
- **Overline (table headers)**: `0.6875rem`, 600 weight, `0.08em` letter-spacing, uppercase
- **Buttons**: 600 weight, `0.875rem`, no text-transform

### Shapes

```
 Card radius:    12px
 Button radius:  8px
 Input radius:   8px
 Dialog radius:  12px
 Chip radius:    6px
 Tooltip radius: 6px
 Menu radius:    10px
```

### Spacing

- Base unit: 8px (MUI `theme.spacing`)
- Standard card padding: 3 (24px)
- Standard gap between form fields: 2.5 (20px)
- Page width: max 1200px

### Shadows / Elevation

- **Cards**: none (use `variant="outlined"` with 1px border instead)
- **Elevation 1**: `0 1px 3px 0 rgba(0,0,0,0.04)` — very subtle
- **Elevation 2**: `0 4px 12px 0 rgba(0,0,0,0.06)` — dropdowns
- **Dialog**: `0 20px 60px rgba(0,0,0,0.12)`
- **Menu**: `0 10px 30px rgba(0,0,0,0.08)`

## Component Patterns

### Page Layout

Every protected page follows this structure:

```tsx
<PageShell title="Page Title" actions={<Button>Action</Button>}>
  {/* page content */}
</PageShell>
```

`PageShell` (at `src/components/ui/PageShell.tsx`) provides:
- Max-width wrapper (1200px)
- Page title as `<Typography variant="h4">` with 700 weight
- Optional actions slot for buttons

### Loading State

Use `LoadingState` for all async data loading:

```tsx
if (isLoading) return <LoadingState />;
// or with custom message:
if (isLoading) return <LoadingState message="Fetching data..." />;
```

### Cards

Always use `variant="outlined"` (no elevation, 1px border):

```tsx
<Card variant="outlined">
  <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
    {/* content */}
  </CardContent>
</Card>
```

### Tables

Use MUI `Table` with outlined `Paper` container. All table styling is handled by the theme:

```tsx
<TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Column</TableCell>
        <TableCell align="right">Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {data?.map((item) => (
        <TableRow key={item.id} hover>
          <TableCell>...</TableCell>
          <TableCell align="right">
            <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
              <IconButton size="small" onClick={...}>
                <Pencil size={16} />
              </IconButton>
            </Stack>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
```

### Forms / Dialogs

Use MUI `Dialog` for create/edit modals:

```tsx
<Dialog open={dialogOpen} onClose={close} maxWidth="sm" fullWidth>
  <Box component="form" onSubmit={handleSubmit}>
    <DialogTitle>Title</DialogTitle>
    <DialogContent>
      <Stack spacing={2.5} sx={{ mt: 1 }}>
        <TextField label="Field" fullWidth ... />
      </Stack>
    </DialogContent>
    <DialogActions>
      <Button onClick={close}>Cancel</Button>
      <Button type="submit" variant="contained">Save</Button>
    </DialogActions>
  </Box>
</Dialog>
```

### Buttons

- **Primary**: `variant="contained"` — indigo fill, used for main CTAs
- **Secondary**: `variant="outlined"` — used for pagination, secondary actions
- **Ghost/Text**: `variant="text"` or IconButton — used for inline actions (edit/delete)
- **Danger**: `color="error"` — used for delete actions
- All buttons: `disableElevation: true` by default in theme
- Loading state: use `disabled` prop during mutations

### Chips / Badges

Use MUI `Chip` for status labels:

```tsx
<Chip label="active" size="small" color="success" />
<Chip label="cancelled" size="small" color="error" />
```

Color mapping for statuses:
- SCHEDULED: `info`
- CONFIRMED: `primary`
- IN_PROGRESS: `warning`
- COMPLETED: `success`
- CANCELLED: `error`
- NO_SHOW: `default`

### Icons

Use **lucide-react** for all icons. Never use emoji as icons. Import the specific icon:

```tsx
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
```

Common icon sizes:
- In buttons (with text): `size={18}`
- In IconButton: `size={16}` for small, `size={20}` for default
- In sidebar: `size={20}`
- In stat cards: `size={20}`

### Navigation / Layout

- **Sidebar**: 260px wide, MUI `Drawer`, responsive (temporary on mobile, permanent on desktop)
- **Nav links**: Dashboard, Appointments, Clients, Services, Team, Settings — uses lucide icons matching each section
- **Header**: MUI `AppBar` with `color="inherit"`, contains user avatar dropdown menu
- **Active nav state**: indigo-50 background + indigo-600 text via MUI `ListItemButton` `selected` prop

### User Avatar

Initials-based avatar with indigo background:

```tsx
<Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: '0.875rem', fontWeight: 600 }}>
  {user?.firstName?.[0]}{user?.lastName?.[0]}
</Avatar>
```

## Page-Specific Patterns

### Dashboard

Stat cards in a 4-column grid (`Grid container spacing={3}`, each item `size={{ xs: 6, lg: 3 }}`). Appointment cards in a 3-column grid below.

### CRUD Pages (Appointments, Clients, Services)

All follow the same pattern:
1. `PageShell` with title + "Add" button
2. `TableContainer > Table` for data display
3. Edit/Delete actions per row via `IconButton` with `Pencil`/`Trash2` icons
4. Pagination controls via `Button` with `ChevronLeft`/`ChevronRight` icons
5. Create/Edit `Dialog` modal with form fields in a `Stack spacing={2.5}`
6. Form fields use `TextField` (with `select` for dropdowns, `multiline` for textareas, `type="number"` for numbers, `type="datetime-local"` for dates)

### Auth Pages (Login, Register)

Centered layout with max-width card, no sidebar/header. Use `Card variant="outlined"` with text fields and a contained submit button. Include links for switching between login/register.

### Settings

Single card form with save button. On success, show a temporary `Alert` with `severity="success"`.

## Responsive Behavior

- **Mobile first**: all responsive via MUI's `sx` breakpoints (`xs`, `sm`, `md`, `lg`)
- **Sidebar**: hidden on mobile, shown as overlay drawer triggered by hamburger icon
- **Page header**: stacks vertically on mobile (title above actions)
- **Grids**: stat cards go 2-col on mobile, 4-col on desktop
- **Forms**: full width on all sizes

## Accessibility

- All interactive elements are MUI components with built-in ARIA
- Color contrast: text passes WCAG AA against backgrounds
- Focus indicators: MUI defaults
- Reduced motion: not explicitly disabled (animations are minimal by design)

## Directory Structure

```
src/
  components/
    guards/       AuthGuard.tsx
    layout/       AppLayout.tsx, Sidebar.tsx
    ui/           PageShell.tsx, LoadingState.tsx
  pages/
    appointments/ AppointmentsPage.tsx
    auth/         LoginPage.tsx, RegisterPage.tsx
    clients/      ClientsPage.tsx
    dashboard/    DashboardPage.tsx
    services/     ServicesPage.tsx
    settings/     SettingsPage.tsx
    team/         TeamPage.tsx
  theme.ts        MUI theme config (all design tokens)
  index.css       Font imports + minimal global styles
```

## Import Conventions

- MUI components: import individually (e.g., `import Box from '@mui/material/Box'`)
- lucide-react: import icons individually (e.g., `import { Plus, Pencil } from 'lucide-react'`)
- Other project modules: use relative imports (e.g., `import { PageShell } from '../../components/ui/PageShell'`)
- Types: import from `'../../types'`

## Theming

All design tokens live in `src/theme.ts`. The theme is applied via `ThemeProvider` in `AppProviders.tsx`. Never override theme tokens in individual components — use `sx` for per-component overrides, and update `theme.ts` for global changes.

To reference theme values in `sx`, use string paths like `'primary.main'`, `'text.secondary'`, `'background.default'`. Avoid hardcoding hex values in components.

## Staff Management (Team Page)

- **Route**: `/team`
- **Backend**: Uses `GET /users`, `POST /users`, `DELETE /users/:id` endpoints
- **Owner protection**: OWNER role members cannot be deleted (remove button hidden)
- **Role display**: Uses `Chip` with icons — `Shield` icon for OWNER, `User` icon for others
- **Create dialog**: Requires firstName, lastName, email, password (min 6 chars), role (ADMIN/STAFF), phone (optional)
- Uses the same `PageShell > Table > Dialog` pattern as other CRUD pages

## Staff Revenue (Dashboard)

Computed client-side from the `useAppointmentsByDate` data:
1. Filter to `COMPLETED` appointments only
2. Group by `user.id` (staff member)
3. Sum `service.price` per staff member
4. Display with earnings calculation: `revenue - (revenue * commissionRate / 100)`

Uses a custom local `Stack` component in DashboardPage (avoids importing MUI Stack for this single use).

## Commission Rate (Settings)

- Stored as a `Decimal` field on the Tenant model (`commissionRate`)
- Displayed in a dedicated Settings card with:
  - Number input with `%` end adornment (`InputAdornment`)
  - Range 0–100, step 0.5
  - Helper text explaining the split between business and staff
  - Read from `useTenant()`, written via `tenantsApi.updateTenant`
- Backend: Added to Prisma schema via migration `add_commission_rate`

## Common MUI v6 API Notes

- `InputLabelProps` → `slotProps={{ inputLabel: ... }}`
- `inputProps` → `slotProps={{ htmlInput: ... }}`
- `primaryTypographyProps` on ListItemText → use `sx={{ '& .MuiListItemText-primary': { ... } }}`
- `Stack` does not support `justifyContent` as a direct prop → use `sx={{ justifyContent: '...' }}`
- `Grid` uses `size={{ xs, sm, md, lg }}` instead of `xs={12} sm={6}`
- `Link` component with `component={RouterLink}`: pass typography overrides via `sx`, not as direct props
