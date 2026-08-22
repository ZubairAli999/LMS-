# School Management System
## Description

This Node.js application provides a comprehensive solution for managing school administrative tasks and student examination processes. It has distinct modules for teachers/administrators and students, facilitating various actions such as exam management, student promotion, and staff administration.

## Features

### Teachers/Admin
Staff Registration: Admin can register new staff members.
Staff Login: Secure login functionality for staff members.
Admin Withdrawing Staff: Admin has the ability to remove staff members.
Admin Suspending Staff: Admin can suspend staff accounts.
Creating Exams: Staff can create exams for students.
Promoting Student: Admin can manage student promotions to the next grade or level.
Staff Withdrawal: Staff can deregister themselves from the system.
Publish/Unpublish Results: Admin can control the publication of exam results.

### Students
Writing Exams: Students can complete their exams online.
Checking Exam Results: Students can check their exam results.
Student Can Attempt Exam Twice: The system allows students a second attempt at an exam.
Exams Remark: Functionality to request remarking of an exam.

## Academic Module Setup (Admin Section)
### Overview
The Academic module is the core of the school management system, where the administrator can configure and manage the academic structure of the institution. The following are the key components of the Academic module:

### Components
Subjects: Admin can manage the list of subjects that are taught in the institution. This includes adding new subjects, editing existing ones, and assigning them to specific year groups or programs.

#### Programs: The admin can create and manage various academic programs offered by the institution. Programs may consist of a set of subjects and are usually associated with a particular level of study or department.

#### Student Admission: The administration of student admissions falls here, where the admin can oversee the entire admission process from application to enrollment.

#### Staff Employment: This component deals with the hiring and management of teaching and non-teaching staff, including their roles, permissions, and personal information management.

#### Academic Year: Administrators define the start and end dates of an academic year, and it's often the top-level time frame for planning the academic calendar.

#### Academic Term: This refers to the division of the academic year into terms or semesters. Admins set up term dates and associate them with the corresponding academic activities.

#### Year Group: The admin can set up and manage year groups or classes, assign students to them, and track their progress throughout the academic year.

### Functionality

- Set up and manage academic years, terms, and specific dates for each.
- Create and modify the structure of year groups and programs.
- Manage admissions, including setting up admission criteria, application forms, and tracking applicant status.
- Oversee staff employment processes, from recruitment to assigning roles within the school structure.
- Define subjects, along with the curricula, and associate them with the appropriate year groups and programs.

## Packages

This project uses the following main dependencies:

- `dotenv`: For managing environment variables.
- `express`: Fast, unopinionated, minimalist web framework for Node.js.
- `mongoose`: MongoDB object modeling tool designed to work in an asynchronous environment.

And the following development dependencies:

- `morgan`: HTTP request logger middleware for Node.js.
- `nodemon`: A utility that will monitor for any changes in your source and automatically restart your server.

## Installation

Before installing, make sure you have Node.js and npm (Node Package Manager) installed on your system. You can download them from [Node.js official website](https://nodejs.org/).

1. Clone the repository to your local machine.

1. Install the dependencies:
`npm install`

2. Running the Application
To start the application, you can use the following npm scripts defined in the package.json:

- To start the server with node:
`npm start`

- To start the server with nodemon for development (auto-restarts the server on file changes):
`npm run server`

## Setting up Postman
The API is built using Express.js and serves a RESTful JSON API. You can interact with it through a tool like Postman. I will provide the public API for my postman collection for this project if you would like to pull it.

## Setting up MongoDB
To set up your MongoDB environment, you can either install MongoDB locally or use a MongoDB cloud service like MongoDB Atlas.

### Local MongoDB Installation
1. Download MongoDB from the MongoDB official website.
2. Follow the installation instructions for your operating system.
3. Ensure MongoDB is running on your system. Typically, MongoDB runs at mongodb://localhost:27017. The instance on this code runs on port 2020

### Using MongoDB Atlas
1. Create an account or log in at MongoDB Atlas.
2. Follow the instructions to create a new cluster.
3. Once your cluster is set up, create a database user, and whitelist your IP address.
4. Connect your application to the cluster by copying the connection string provided by Atlas. Make sure to replace the <password> with your database user's password and <dbname> with the name of your database.

### Configuring the Application
Create a .env file in the root of your project and add your MongoDB URI:

`MONGO_URI=your_mongodb_connection_string`

Replace your_mongodb_connection_string with your actual connection string either from your local MongoDB installation or MongoDB Atlas.

## Author
Adam Lopez

## License
This project is licensed under the ISC License.

This README section provides a comprehensive guide for potential contributors or users of your LMS System, including how to set it up, run it, and connect it with a MongoDB database. Adjustments can be made based on your specific repository URL or any additional steps you may require.