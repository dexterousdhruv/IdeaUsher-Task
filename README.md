# 📘 Post API Task

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Setup and Installation](#setup-and-installation)
5. [API Documentation](#api-documentation)

---

## Project Overview

**Post API** is a TypeScript-based backend API for managing blog posts, supporting advanced querying capabilities including:

- Keyword search in title and description
- Tag-based post filtering
- Sorting, filtering, and pagination from a single unified endpoint
- Cloud image upload via Cloudinary
- Strong validation with Zod
- Centralized error handling using `http-errors`

This project is ideal for use in content-based web apps, admin panels, or blogging platforms.

---

## Technology Stack

- **Express.js** (v5)
- **TypeScript**
- **Mongoose** (MongoDB ODM)
- **Cloudinary + Multer** for image storage

---

## Project Structure

```yaml
src/
├── connect/
│   └── connect.ts
├── controllers/
│   └── post.controller.ts
├── routes/
│   └── post.routes.ts
├── models/
│   ├── post.model.ts
│   └── tag.model.ts
├── utils/
│   └── validations.ts
│   └── cloudinary.ts
│   └── multerConfig.ts
└── index.ts
```

## Setup and Installation

1.  Clone the repository:

    ```
    git clone https://github.com/dexterousdhruv/IdeaUsher-Task.git
    cd IdeaUsher-Task
    ```

2.  Install dependencies for both packages:

    ```
    cd IdeaUsher-Task
    npm install
    ```

3.  Set up environment variables:

    Create a `.env` file (Refer to `.env.example`):
      ```
      PORT=3000

      DB_URL=your_mongo_connection_string
      CLIENT_URL=http://localhost:5173 (Replace with hosted frontend url)
      
      # Cloudinary credentials

      CLOUDINARY_CLOUD_NAME=your_cloud_name
      CLOUDINARY_API_KEY=your_api_key
      CLOUDINARY_API_SECRET=your_api_secret

      ```

4.  Start the development server:
    ```
    npm run dev
    ```

---

## API Documentation

All endpoints are prefixed with `/api/posts`.



### POST `/`

Create a new post with cover image upload.

**Request Body:** `multipart/form-data`

**Fields:**

| Field       | Type                 | Description                                    |
| :---------- | :------------------- | :--------------------------------------------- |
| `title`     | `string`             | Minimum 3 characters.                          |
| `description` | `string`             | Minimum 10 characters.                         |
| `tags`      | `string` or `array` of `string` | Must have at least one tag.                    |
| `coverImage`| `image file`         | Supported formats: jpg, png, etc.              |

---

### GET `/`

Get all posts with optional filtering, sorting, and pagination.

**Query Parameters:**

| Parameter | Type     | Description                                     | Default |
| :-------- | :------- | :---------------------------------------------- | :------ |
| `page`    | `number` | Page number for pagination.                     | `1`     |
| `limit`   | `number` | Number of posts per page.                       | `10`    |
| `sort`    | `string` | Sort order (e.g., `-createdAt` for descending by creation date, `title` for ascending by title). |         |
| `keywords`    | `string` | Comma-separated list of tag names to filter by. |         |

---

### GET `/by-tags?tags=ai,tech`

Search for posts to filter posts using tags.

**Query Parameters:**

| Parameter | Type     | Description                                     |
| :-------- | :------- | :---------------------------------------------- |
| `tags`    | `string` | The keyword to search for in titles and descriptions. |

### GET `/search?q=`

Search for posts where the title or description contains the given keyword.

**Query Parameters:**

| Parameter | Type     | Description                                     |
| :-------- | :------- | :---------------------------------------------- |
| `q`       | `string` | The keyword to search for in titles and descriptions. |