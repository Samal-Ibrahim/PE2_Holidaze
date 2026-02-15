# Reflection below

# Holidaze - Venue Booking Platform

A modern, full-featured venue booking application built with React, TypeScript, and Vite. Users can browse venues, make reservations, and venue managers can create and manage their listings.

## Features

### For Users
- **Browse Venues** - Explore available venues with filters (price, rating, city, amenities)
- **View Details** - See comprehensive venue information, images, location, and amenities
- **Book Venues** - Interactive date picker with disabled booked dates, guest selection
- **Manage Bookings** - View upcoming and past bookings, cancel reservations
- **User Profile** - Complete profile management with avatar and banner customization

### 🏢 For Venue Managers
- **Create Venues** - Add new venues with detailed information, media, and location
- **Edit Venues** - Update venue details anytime
- **Delete Venues** - Remove venues no longer in service
- **Track Bookings** - See all bookings for your venues
- **Manage Amenities** - Configure WiFi, parking, breakfast, pet policies

### Authentication & Authorization
- Student email registration (@stud.noroff.no)
- Secure login with token-based authentication
- Role-based access control (user vs venue manager)

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2.0 | UI framework |
| TypeScript | ~5.9.3 | Type safety |
| Vite | 7.2.4 | Build tool & dev server |
| React Router | 7.11.0 | Client-side routing |
| TanStack Query | 5.90.16 | Server state management |
| Tailwind CSS | 4.1.18 | Styling |
| Zod | 4.3.6 | Schema validation |
| React Day Picker | 9.13.0 | Calendar component |
| React Toastify | 11.0.5 | Notifications |
| Biome | 2.3.10 | Code formatting & linting |

## Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn** package manager
- Student email address (@stud.noroff.no) for registration

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/FransoArbela/PE2_Holidaze.git
cd PE2_Holidaze
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the project root:
```env
VITE_API_BASE_URL=https://v2.api.noroff.dev
VITE_API_KEY=your_api_key_here
```

Get your API key from the [Noroff API documentation](https://docs.noroff.dev/).

### 4. Start Development Server
```bash
npm run dev
```

The application will open at `http://localhost:5173`

## Usage

### First Time Setup

1. **Register** - Go to `/register` and create an account with:
   - Name
   - Student email (@stud.noroff.no)
   - Password (minimum 8 characters)

2. **Login** - Use your credentials to login at `/login`

### For Regular Users

1. **Browse Venues** (`/venues`)
   - Use filters: Price range, City, Rating, Amenities
   - Sort by: Latest, Oldest, Cheapest, Most Expensive
   - Click venue to view details

2. **Make a Booking**
   - Select check-in and check-out dates (booked dates are disabled in red)
   - Choose number of guests (max: venue's max capacity)
   - Click "Reserve" button
   - Confirmation toast will appear

3. **Manage Bookings** (`/profile`)
   - View all your bookings on "My Bookings" tab
   - See booking dates, venue details, and price
   - Cancel bookings with confirmation dialog

4. **Update Profile** (`/profile/edit-profile`)
   - Change name, avatar, or banner
   - Changes are reflected immediately

### For Venue Managers

1. **Create a Venue** (`/create`)
   - Fill in basic information (name, description, price, max guests)
   - Add optional rating
   - Upload at least one image
   - Select amenities (WiFi, parking, breakfast, pets)
   - Enter location details (address, city, country, coordinates)
   - Submit to create

2. **Manage Venues** (`/profile`)
   - Click "My Venues" tab to see all your venues
   - Click "Edit" button on any venue card:
     - Update all venue details
     - Add/remove images
     - Modify amenities and location
     - Save changes
   - Delete venues (with confirmation)

3. **View Bookings**
   - Each venue shows booking availability on its calendar
   - Booked dates appear in red and cannot be selected
   - See all reservations for your venues on the profile page


## Available Scripts

### Development
```bash
npm run dev          
```

### Production
```bash
npm run build       
npm run preview      
```

### Code Quality
```bash
npm run format       
npm run lint        
npm run test        
```

### Prepare Git Hooks
```bash
npm run prepare    
```

## API Integration

The application integrates with the Noroff REST API v2.

### Base URL
```
https://v2.api.noroff.dev
```

### Key Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/register` | POST | Register new user |
| `/auth/login` | POST | Authenticate user |
| `/holidaze/venues` | GET/POST | List/create venues |
| `/holidaze/venues/{id}` | GET/PUT/DELETE | Venue operations |
| `/holidaze/bookings` | POST | Create booking |
| `/holidaze/bookings/{id}` | DELETE | Cancel booking |
| `/profiles/{name}` | GET | Get user profile |
| `/profiles/{name}` | PUT | Update profile |

## Features in Detail

### Date Picker Calendar
- React Day Picker integration with disabled dates
- Booked dates shown in red
- Past dates automatically disabled
- Single range selection for check-in/check-out
- Click outside to close calendar

### Form Validation
- Email validation (@stud.noroff.no required)
- Password strength requirements (min 8 chars)
- URL validation for images
- Price and guest validation
- Real-time validation feedback

### State Management
- TanStack Query for server state
- Automatic cache invalidation
- React Context for auth state
- localStorage for persistence

### Error Handling
- Centralized API error handler
- User-friendly error messages
- Automatic error recovery
- Toast notifications for feedback

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern browsers with ES2020+ support

## Performance Optimizations

- Code splitting via Vite
- Image lazy loading
- Memoized computations with useMemo
- Optimized re-renders
- Query caching with React Query

## Git Workflow

This project uses Husky for git hooks:

```bash
git add .
git commit -m "feat: add new feature" 
git push origin main
```

## Troubleshooting

### "API key is not configured" Error
- Check `.env.local` file exists
- Verify `VITE_API_KEY` is set correctly
- Restart dev server after adding env vars

### "Email must end with @stud.noroff.no" Error
- Only student emails are allowed for registration
- Use your Noroff student email address

### Booked dates not showing on calendar
- Clear browser cache
- Check API key has correct permissions
- Verify venue has bookings in the system

### Changes not reflecting
- TanStack Query caches data for 5 minutes by default
- Manually refresh (Ctrl+R) or invalidate cache
- Check Network tab for failed requests

## Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

## License

This project is part of the Noroff PE2 course and is provided as-is.

## Support

For issues, questions, or suggestions:
- Check existing GitHub issues
- Review the [Noroff API Documentation](https://docs.noroff.dev/)
- Contact course instructors

## Author

**Samal** - Noroff Student

---

## Project Process Reflection: PE2 Holidaze
During PE2 Holidaze, I worked on both building features and improving the overall structure
of the project. I built the venue viewing and booking system, implemented the profile modal
for editing venues, and integrated React Day Picker for selecting date ranges. At some
point, I stepped back and reviewed the whole codebase instead of just continuing with
features. During that review, I found and fixed more than 20 issues that could have caused
problems in production.

One thing that worked well was doing a full project scan early. I noticed inconsistent API
patterns, different error handling approaches, and unpredictable state management.
Instead of fixing issues randomly, I standardized how API calls were written and made sure
data fetching followed the same pattern using TanStack React Query. I also created a
centralized apiClient with consistent error handling, which removed repetitive code and
made the project easier to maintain.

Using TypeScript helped significantly during refactoring. When renaming functions across
multiple components, the type system immediately highlighted broken imports and
mismatches. That allowed me to refactor confidently without introducing hidden runtime
errors.

The biggest challenge was understanding React Query more deeply. I struggled with state
synchronization, especially around the date picker and modal refresh behavior. At first, I
assumed the issue was in the feature logic, but it was actually related to how useState
initializes only once and does not automatically resync with external changes. After
reviewing the documentation and testing different approaches, I realized I needed to
explicitly control when and how state updates occur.

Bulk refactoring also exposed smaller technical issues. When replacing Tailwind classes
across multiple files, some identical-looking strings failed to match. The problem turned
out to be whitespace differences such as tabs and spaces. That experience reinforced the
importance of inspecting file content carefully rather than relying on visual similarity.
The image management feature, where users can add and remove media items, felt
complex at first because of state updates. Separating the logic into smaller functions like
handleAddImage and handleRemoveImage made the behavior clearer and easier to debug.
Adapting to React Query required shifting from thinking only about component-level state
to thinking about server state, caching, staleTime, gcTime, and query invalidation. Once I
understood these concepts, many UI updates became simpler because the data stayed
synchronized automatically after successful mutations.

Overall, this project reinforced that good development is not only about building features. It
is also about consistency, structure, and making code easier to understand for future
changes. I learned that refactoring and reviewing existing code is just as important as
implementing new functionality

**Last Updated:** February 2026  
**Version:** 1.0.0
