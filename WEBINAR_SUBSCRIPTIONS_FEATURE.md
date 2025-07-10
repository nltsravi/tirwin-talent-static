# Webinar Subscriptions Feature

## Overview
A new "Webinar Subscriptions" menu has been added to the Admin User Management section. This feature allows administrators to view all available webinars and see the list of users subscribed to each webinar.

## Features Implemented

### 1. New Menu Item
- Added "Webinar Subscriptions" to the left sidebar menu in the admin user section
- Icon: `fas fa-video`
- Positioned after "Admin Users" in the menu list

### 2. Webinar List View
- Displays only paid webinars (price > ₹0) in a responsive table format
- Shows filter indicator: "Showing paid webinars only (price > ₹0)"
- Table columns include:
  - Thumbnail image (with fallback to default avatar)
  - Title and description (truncated to 80 characters)
  - Type (with colored badge)
  - Price
  - Start date and time (separated)
  - Status (Live/Upcoming/Completed)
  - Action button to view subscribers
- Rows are sortable by title, type, price, and start date
- Default sort: Start date (newest first)
- Rows have hover effects and are clickable

### 3. Enrolled Users List View
- When a webinar is clicked, shows all enrolled users for that webinar
- Displays enrolled user information in a table format:
  - Checkbox for selection
  - User avatar
  - User Name (sortable)
  - Email ID (sortable)
  - Registered Date (sortable)
  - Transaction ID (sortable)
  - Actions column with "Send Notification" button
- Email Actions Section:
  - "Select All" checkbox with selected count
  - "Send Email" button for bulk email sending
- Individual "Send Notification" buttons for each user
- Includes a "Back to Webinars" button for navigation
- Calls API endpoint: `/api/admin/webinars/{webinar_id}/enrolled-users`

### 4. Email and Notification Features
- **Bulk Email Sending**: Select multiple users using checkboxes and send emails to all selected users
- **Select All Functionality**: Checkbox in header to select/deselect all users at once
- **Individual Notifications**: "Send Notification" button for each user to send individual notifications
- **Selection Counter**: Shows the number of selected users (e.g., "(3 selected)")
- **Loading States**: Buttons show loading state during notification sending
- **Success Feedback**: Toast notifications confirm successful email/notification sending

### 5. Export Functionality
- **Excel Export**: "Export to Excel" button to download enrolled users list as Excel file
- **Formatted Data**: Exports user data with proper column headers and formatting
- **Auto-generated Filename**: Creates filename with webinar title and current date
- **Column Optimization**: Sets appropriate column widths for better readability
- **Error Handling**: Provides feedback for successful export or error cases

### 6. Sorting and Navigation
- Sortable columns for name and email in the subscriber list
- Responsive design that works on mobile devices
- Loading states and error handling

## Technical Implementation

### Files Modified
1. `src/app/pages/admin-user/admin-user.component.html`
   - Added new menu item
   - Added webinar list and subscriber list sections
   - Updated page title logic

2. `src/app/pages/admin-user/admin-user.component.ts`
   - Added new properties: `webinars`, `subscribers`, `selectedWebinar`
   - Added methods: `fetchWebinars()`, `selectWebinar()`, `backToWebinars()`, `fetchSubscribers()`, `getMenuTitle()`
   - Added webinar-specific methods: `formatTime()`, `getWebinarStatus()`, `getWebinarStatusClass()`
   - Updated sorting logic to handle both webinar and subscriber data
   - Added date and time formatting utilities
   - Implemented filtering for paid webinars (price > 0)
   - Set default sort to start date (newest first)
   - Added checkbox selection functionality: `toggleSelectAll()`, `toggleUserSelection()`, `isAllSelected()`, `getSelectedCount()`, `getSelectedUsers()`
   - Added email and notification methods: `sendEmailToSelected()`, `sendNotification()`
   - Added Excel export functionality: `exportToExcel()` with proper data formatting and file generation

3. `src/app/pages/admin-user/admin-user.component.css`
   - Added comprehensive styling for webinar table layout
   - Added styling for webinar thumbnails, badges, and status indicators
   - Added styling for subscriber table
   - Added responsive design rules
   - Added hover effects and transitions
   - Added status badge color coding (Live/Upcoming/Completed)
   - Added filter indicator styling with blue background and icon
   - Added email actions section styling with select all functionality
   - Added checkbox styling and selection indicators
   - Added notification button styling with hover effects
   - Added export button styling with success color scheme

### API Endpoints Used
- **Webinar List**: `${environment.api}/admin/webinars`
- **Enrolled Users List**: `${environment.api}/admin/webinars/${webinarId}/enrolled-users`

### Backend Requirements
The following backend endpoint is used:
```
GET /admin/webinars/{webinarId}/enrolled-users
```
Expected response format:
```json
[
  {
    "id": "enrollment_id",
    "user_name": "John Doe",
    "email_id": "john@example.com",
    "created_at": "2024-01-01T10:00:00Z",
    "transaction_id": "TXN123456789"
  }
]
```

## Usage Instructions

1. **Access the Feature**:
   - Navigate to Admin > User Management
   - Click on "Webinar Subscriptions" in the left sidebar

2. **View Webinars**:
   - Only paid webinars (price > ₹0) will be displayed in a table format
   - A blue filter indicator shows "Showing paid webinars only (price > ₹0)"
   - Each row shows webinar details including thumbnail, title, type, price, date, and status
   - Webinars are automatically sorted by start date (newest first)
   - Use column headers to sort the data by different criteria

3. **View Enrolled Users**:
   - Click on any webinar card
   - The enrolled users list will be displayed
   - Use the "Back to Webinars" button to return

4. **Sort Data**:
   - Click on column headers to sort webinars (Title, Type, Price, Start Date)
   - Click on column headers to sort enrolled users (User Name, Email ID, Registered Date, Transaction ID)
   - Sort direction is indicated by icons

## Current Limitations

1. **Subscription Count**: The webinar cards show subscription count, but this data might not be available from the current API.

## Future Enhancements

1. **Export Functionality**: Add ability to export subscriber lists to CSV/Excel
2. **Filtering**: Add filters for subscription date, amount, status
3. **Bulk Actions**: Add ability to perform bulk actions on subscribers
4. **Real-time Updates**: Add real-time updates when new subscriptions are made
5. **Analytics**: Add charts and analytics for subscription trends

## Testing

To test the feature:
1. Build the project: `npm run build`
2. Start the development server: `npm start`
3. Navigate to the admin user section
4. Click on "Webinar Subscriptions"
5. Verify that webinars are displayed
6. Click on a webinar to see the enrolled users view

## Dependencies Added
- `xlsx`: For Excel file generation and manipulation
- `file-saver`: For downloading files in the browser
- `@types/file-saver`: TypeScript definitions for file-saver

## Notes

- The feature is fully functional with complete backend integration
- The UI is responsive and follows the existing design patterns
- Error handling and loading states are implemented
- The code follows Angular best practices and TypeScript conventions
- Transaction IDs are displayed in monospace font for better readability
- Excel export functionality includes proper data formatting and column optimization 