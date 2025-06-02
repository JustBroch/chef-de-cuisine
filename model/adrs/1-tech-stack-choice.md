# 1. Selection of Technology Stack

Date: 2025-05-13

Status: Accepted

## Summary

We decided to use the following technologies for this project:
1. Frontend - React, TypeScript
2. Backend - Python, Flask
3. Database - PostgreSQL

## Context

React is a JavaScript library for creating User Interfaces (UIs), specifically designed for building single page applications that provide users with a fast, interactive and seamless experience while navigating through the website. 

Through the Cloud Infrastructure Assignment in this course, where we learned to implement the API functionalities using Python Flask, we believe we can now efficiently develop APIs to handle user requests. Furthermore, PostgreSQL is a powerful database management system that can be used to store large amounts of data, including user profiles, authentication credentials, or recipes.

## Decision

We have decided to implement the said tech stack for the following reasons:

React will enable us to create a fast, interactive, and responsive single-page application, improving user experience by minimizing page reloads and providing dynamic content updates. Using TypeScript will allow us to create and customise the front-end to allow for more flexibility in design.

Flask offers a flexible way to develop and expose RESTful APIs. Given our prior experience with Flask in the Cloud Infrastructure Assignment, we can efficiently design APIs that connect the frontend with the backend services.

PostgreSQL is a robust, scalable, and open-source relational database that supports complex queries, advanced data types (such as JSON), and full ACID compliance, making it well-suited to handle user data, recipes, and other application data securely and reliably.

This technology stack aligns with the project’s requirements for availability, extensibility, maintainability, and efficient development, while also leveraging technologies and tools that the team can work with.

## Consequences

**Advantages**

All team members are familiar with these technologies, which allows everyone to contribute equally to the implementation of the project. Additionally, team members can support each other if anyone encounters difficulties.