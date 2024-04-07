# BookList Page Acceptance Test

## Feature: BookList Page Functionality

### Scenario: Page Load

- **Given** I am on the BookList page
- **Then** I should see the sidebar
- **And** I should see a search input box
- **And** I should see a list of books

### Scenario: Book Data Display

- **Given** I am on the BookList page
- **When** the book data has finished loading
- **Then** each visible book should display a corresponding BookCoverCard
- **And** the title on each BookCoverCard should match the data retrieved from the database

### Scenario: Specific Book Display - '1984'

- **Given** I am on the BookList page
- **And** the book data has finished loading
- **Then** I should see at least the following book '1984'
- **And** '1984' should display a corresponding BookCoverCard
- **And** the title on the '1984' BookCoverCard should match the title '1984' from the database

### Scenario: Search Functionality

- **Given** I am on the BookList page
- **When** I enter '1984' into the search box
- **Then** the list of books should be filtered to only show '1984'
- **And** the '1984' BookCoverCard should be displayed

---

## Feature: BookList to ViewBook Navigation

### Scenario: Navigating from BookList to ViewBook

- **Given** I am on the `BookList` page
- **When** I click on the book titled '1984'
- **Then** I should be redirected to the `ViewBook` page for '1984'

## Feature: Displaying Book Information on ViewBook Page

### Scenario: Page Load

- **Given** I have navigated to the `ViewBook` page by clicking '1984' from the `BookList`
- **Then** I should see the sidebar
- **And** I should see the `BookCoverCard` component with the book cover for '1984'
- **And** I should see the `BookDetailsCard` component with the details for '1984'
- **And** I should see the `ReviewsList` component with reviews for '1984'

### Scenario: Book Cover Card Display on ViewBook Page

- **Given** I am on the `ViewBook` page for '1984'
- **Then** the `BookCoverCard` should display a large cover of '1984'
- **And** the title '1984' should be displayed on the `BookCoverCard`

### Scenario: Book Details Card Display on ViewBook Page

- **Given** I am on the `ViewBook` page for '1984'
- **Then** the `BookDetailsCard` should display the title, author, pages, and genre for '1984'
- **And** the input fields should be populated with the current details of '1984'
- **And** the "Edit Book Details" button should be visible

### Scenario: Displaying Reviews on ViewBook Page

- **Given** I am on the `ViewBook` page for '1984'
- **Then** the `ReviewsList` component should display existing reviews for '1984'
- **And** I should be able to submit a new review for '1984' using the review submission form

---

# Acceptance Test Documentation

## Feature: Book Reviews Interaction

### Scenario: Review List Display on ViewBook Page

- **Given** I am on the `ViewBook` page
- **Then** I should see the `ReviewList` component which includes the `ReviewForm` for submitting new reviews and a list of existing reviews
- **And** each review in the list should be encapsulated in a `ReviewCard` component

### Scenario: Submitting a New Review

- **Given** I am on the `ViewBook` page
- **When** I enter a title, choose a rating, and write a review in the `ReviewForm`
- **And** I submit the review
- **Then** my review should be added to the `ReviewList` component
- **And** I should see my review appear at the top of the reviews list

### Scenario: Review Card Display

- **Given** I am viewing the list of reviews on the `ViewBook` page
- **Then** each `ReviewCard` should display the title of the review, the reviewer's name, the rating in stars, and the review text
- **And** if available, show the "Verified Purchase" icon

### Scenario: Filtering Reviews

- **Given** I am on the `ViewBook` page
- **When** I select a star rating filter in the `ReviewFilter` component
- **Then** the list of reviews should be updated to only show reviews matching the selected rating

### Scenario: Replying to a Review

- **Given** I am viewing the list of reviews on the `ViewBook` page
- **When** I click the "Reply" button on a `ReviewCard`
- **Then** a `ReplyForm` should be displayed, allowing me to write a response
- **And** after submitting my reply, it should be displayed underneath the corresponding review

### Scenario: Viewing Review Replies

- **Given** there are reviews with replies in the `ReviewList`
- **Then** each reply should be displayed under the corresponding `ReviewCard`

## Feature: Sign Up

### Scenario: Sign Up - with correct info

- **Given** I am on the `Login` page
- **When** I enter in a new username and long enough password (more than 5 chars)
- **Then** I should successfully be logged in and see `Home`

### Scenario: Sign Up - existing username

- **Given** I am on the `Login` page
- **When** I enter in an existing username and long enough password (more than 5 chars)
- **Then** I see an error alert and `Home` isn't seen

### Scenario: Sign Up - ok username too short password

- **Given** I am on the `Login` page
- **When** I enter in a new username and too short password less than (5 chars)
- **Then** I see an error alert and `Home` isn't seen

### Scenario: Sign Up - already used username too short password

- **Given** I am on the `Login` page
- **When** I enter in an old username and too short password less than (5 chars)
- **Then** I see an error alert and `Home` isn't seen

## Feature: Log In

### Scenario: Log In - with correct info

- **Given** I am on the `Login` page
- **When** I enter an existing username and the password for this account
- **Then** I should successfully be logged in and see `Home`

### Scenario: Log In - not existing username

- **Given** I am on the `Login` page
- **When** I enter an non-existing username and some password
- **Then** I see an error alert and `Home` isn't seen

### Scenario: Log In - ok username wrong password

- **Given** I am on the `Login` page
- **When** I enter an existing username and not the password for this account
- **Then** I see an error alert and `Home` isn't seen

## Feature: Goals

### Scenario: Add a goal

- **Given** I am on the `Goals` page
- **When** I enter the information to create the goal add press the button to create the goal
- **Then** Once the page is refreshed the goal should be visible

### Scenario: Update a goal

- **Given** I am on the `Goals` page
- **When** I enter the information to edit the goal add press the button to create the goal
- **Then** Once the page is refreshed the changes to the goal should be visible
