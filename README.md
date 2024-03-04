<h1 align="center" width="100%" style="text-align: center;">
    <a href="http://172.17.0.80:3000/"><img alt="project" height=200px width="33%" title="#About" src="./frontend/lost-and-found/src/Assets/Images/LAF-logo.png" /></a>
</h1>

<h1 align="center" width="100%" style="text-align: center; color:green;">
  <a href="http://172.17.0.80:3000/"> Lost And Found </a>
</h1>

<h3 align="center" width="100%" style="text-align: center;">We help you find your lost items!</h3>


<p align="center" width="100%" style="text-align: center;">
 <a href="#about">About</a> •
 <a href="#features">Features</a> •
 <a href="#how-it-works">How it works</a> • 
 <a href="#tech-stack">Tech Stack</a> •  
 <a href="#user-scenarios">User Scenarios</a> •  
 <a href="#contributors">Contributors</a> •
 <a href="#test-coverage">Test Coverage</a>
 </p>

## About

Lost and found website is designed to help users find lost items by allowing them to report lost items, search for found items, and connect with others in their community.

---

## Features

- [x] Users can post any item they found
- [x] Users can search in item lost catalogue and request the user for return.
- [x] Connect and chat with the item founder and approved user
- [x] Return the found item and earn rewards


---

## How it works

The project is divided into two parts:

1. Backend 
2. Frontend 



### Pre-requisites

Before you begin, you will need to have the following tools installed on your machine:

- [Git](https://git-scm.com)
- [Node.js](https://nodejs.org/en/) v14.21.3
- [Java](https://www.oracle.com/java/technologies/downloads/) v17
- [Docker](https://www.docker.com/products/docker-desktop/)

### Preferred IDE
- Frontend - [VS Code](https://code.visualstudio.com/download)
- Backend - [Intellj IDEA](https://www.jetbrains.com/edu-products/download/other-IIE.html)


#### Cloning project

```bash

# Clone this repository
$ git clone https://git.cs.dal.ca/courses/2023-fall/csci-5308/Group07

```

#### Running the web application (Frontend)

```bash

# Access the project folder in your terminal
$ cd frontend/lost-and-found

# Install the dependencies
$ npm install

# Run the application in development mode
$ npm run start

# The application will open on the port: 3000 - go to http://localhost:3000
```

#### Build and deploy web application using docker

```bash
# Create docker image of frontend application
$ docker build -t <your_dockerhub_username>/lost-and-found:latest-fe -f ./frontend/LostAndFound/Dockerfile ./frontend/LostAndFound    

# Push the docker image to Docker hub.
$ docker push lost-and-found:latest-fe

# Pull the docker image from Docker hub to your server.
$ docker pull docker.io/<your_dockerhub_username>/lost-and-found:latest-fe

# Run the docker command to start the frontend application on your server.
$ docker run -d -p 3000:3000 --name lost-and-found-frontend docker.io/<your_dockerhub_username>/lost-and-found:latest-fe

```

#### Running the springboot application (Backend)

```bash    

# Access the project folder in your terminal
$ cd Backend/LostAndFound  

# Build the project    
$ mvn clean install     
    
# Run the Spring Boot application 
$ mvn spring-boot:run    
```

#### Build and deploy springboot application using docker

```bash
# Create docker image of backend application
$ docker build -t <your_dockerhub_username>/lost-and-found:latest-be -f ./Backend/LostAndFound/Dockerfile ./Backend/LostAndFound    

# Push the docker image to Docker hub.
$ docker push lost-and-found:latest-be

# Pull the docker image from Docker hub to your server.
$ docker pull docker.io/<your_dockerhub_username>/lost-and-found:latest-be

# Run the docker command to start the backend application on your server.
$ docker run -d -p 8080:8080 --name lost-and-found-backend docker.io/<your_dockerhub_username>/lost-and-found:latest-be

  ```


---


## Tech Stack

The following tools were used in the construction of the project:

<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" alt="React" height="20"> **React**
- A JavaScript library for building user interfaces.

<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/spring/spring-original.svg" alt="Spring Boot" height="20"> **Spring Boot**
- A Java-based framework for building web applications and microservices.

<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg" alt="MongoDB" height="20"> **MongoDB**
- A NoSQL database for storing and retrieving data.



#### Dependencies

##### Frontend

- **@emotion/react**: ^11.11.1
- **@emotion/styled**: ^11.11.0
- **@mui/icons-material**: ^5.14.18
- **@mui/material**: ^5.14.18
- **@testing-library/jest-dom**: ^5.17.0
- **@testing-library/react**: ^13.4.0
- **@testing-library/user-event**: ^13.5.0
- **axios**: ^1.5.1
- **bootstrap-icons**: ^1.11.1
- **cross-env**: ^7.0.3
- **dotenv**: ^16.3.1
- **firebase**: ^10.5.0
- **leaflet**: 1.7.1
- **leaflet-geosearch**: 3.2.1
- **leaflet-search**: ^4.0.0
- **lodash**: ^4.17.21
- **react**: ^17.0.2
- **react-bootstrap**: ^2.9.0
- **react-bootstrap-icons**: ^1.10.3
- **react-bootstrap-toggle**: ^2.3.2
- **react-dom**: ^17.0.2
- **react-footer-comp**: ^3.0.1
- **react-icons**: ^4.11.0
- **react-leaflet**: 3.1.0
- **react-redux**: ^8.1.3
- **react-router-dom**: ^5.3.4
- **react-scripts**: 5.0.1
- **react-scroll**: ^1.9.0
- **react-toastify**: ^9.1.3
- **redux**: ^4.2.1
- **redux-thunk**: ^2.4.2
- **uuid**: ^9.0.1
- **validator**: ^13.11.0
- **web-vitals**: ^2.1.4

##### Backend

- **Spring Boot Starter Parent Version**: 2.7.16
- **Java Version**: 17
- **Auth0 Spring Security API Version**: 1.5.2
- **JUnit Jupiter API Version**: 5.10.1
- **Spring Boot Starter Data MongoDB Version**: 3.1.4
- **Lombok Version**: 1.18.30

---

## User Scenarios

1. **Sign-up Screen**
  ![Signup](https://firebasestorage.googleapis.com/v0/b/lostnfound-7c21c.appspot.com/o/github-readme%2Fimage19.png?alt=media&token=3fa8d262-9194-456b-892c-012b64ff603e)
  <span>
  <span>
2. **Login Screen**
  ![login](https://firebasestorage.googleapis.com/v0/b/lostnfound-7c21c.appspot.com/o/github-readme%2Fimage11.png?alt=media&token=c742bf48-2bd1-476a-8ee1-cd6ce59267d3)
  <span>
  <span>

3. **Verify Email before login**
   ![verify](https://firebasestorage.googleapis.com/v0/b/lostnfound-7c21c.appspot.com/o/github-readme%2Fimage11.png?alt=media&token=c742bf48-2bd1-476a-8ee1-cd6ce59267d3)
  <span>
  <span>

4. **Reset password**
   ![reset](https://firebasestorage.googleapis.com/v0/b/lostnfound-7c21c.appspot.com/o/github-readme%2Fimage16.png?alt=media&token=a7e2b74d-d64e-4eb4-b361-569dce7e1ea5)
   
   ![emailreset](https://firebasestorage.googleapis.com/v0/b/lostnfound-7c21c.appspot.com/o/github-readme%2Fimage13.png?alt=media&token=abba4ca5-5e71-4433-b239-8cd8a756eb66)
   <span>
   <span>
5. **Home Screen**
   <span>
   1. **Found items posted by user**
    ![itemposted](https://firebasestorage.googleapis.com/v0/b/lostnfound-7c21c.appspot.com/o/github-readme%2Fimage20.png?alt=media&token=0c2d183a-9014-4ed4-92f5-907fae0f3646)

   2. **Apply filters (Below image shows filter applied using keyword)**
   ![filter](https://firebasestorage.googleapis.com/v0/b/lostnfound-7c21c.appspot.com/o/github-readme%2Fimage18.png?alt=media&token=52cb5c49-009b-4684-a4d3-f7f6135080ad)
   <span>
   <span>
6. **Report Lost Item**
   <span>
  User can report lost items by entering following details:
   - Name of item
   - Item Description
   - Category
   - Upload images/videos related to item
   - Last seen location of item
  Users can edit the details of posted lost items
   ![postlost](https://firebasestorage.googleapis.com/v0/b/lostnfound-7c21c.appspot.com/o/github-readme%2Fimage6.png?alt=media&token=dfc6a691-fdf5-442a-9bf7-f9dab501d6a7)
   <span>
   <span>
1. **Report Found Item**
   <span>
   User can report found items by entering following details:
   - Name of item
   - Item Description
   - Category
   - Upload images/videos related to item
   - Location at which item was found
  
   ![founditem](https://firebasestorage.googleapis.com/v0/b/lostnfound-7c21c.appspot.com/o/github-readme%2Fimage9.png?alt=media&token=a0ce72a9-90f9-4778-ab44-2717c94cbaaa)
   <span>
   <span>
2. **Lost catalogue (List of items found by all users)**
   <span>
    User can search found items by applying following filters:
   - Keyword (Present in title and description)
   - Date 
   - Category 
   - Location with radius
 
    ![catalogue](https://firebasestorage.googleapis.com/v0/b/lostnfound-7c21c.appspot.com/o/github-readme%2Fimage8.png?alt=media&token=8f7aafcb-a5a0-4f10-85ef-fcc0bab1b00a)
    <span>
   <span>

3.  **Raise claim request by linking your lost item**
   <span>
   While raising claim request, user should linked the lost item posted by them, so that founder can verify authenticity of the request
  
    ![claimlink](https://firebasestorage.googleapis.com/v0/b/lostnfound-7c21c.appspot.com/o/github-readme%2Fimage17.png?alt=media&token=90a7a152-9b04-42c1-b63b-fd576264d0b2)
    <span>
   <span>

4.   **List of claim request received**
   <span>
    1.  **List of request received and user can also filter based on status (Requested, Accepted, Rejected)**
        ![received](https://firebasestorage.googleapis.com/v0/b/lostnfound-7c21c.appspot.com/o/github-readme%2Fimage12.png?alt=media&token=35b86b00-f861-4dbe-b917-b5780819a02d)
    2.  **See the details of linked lost item**
        <span>
        Based on the details of linked lost item, user can decide whether to approve or reject claim request
      ![lostitem](https://firebasestorage.googleapis.com/v0/b/lostnfound-7c21c.appspot.com/o/github-readme%2Fimage5.png?alt=media&token=8cd5fa3c-7adf-48a9-8be9-af108b004289)
    <span>
   <span>


5.  **List of Claim request raised**
  User can revoke claim request posted by them
    ![raised](https://firebasestorage.googleapis.com/v0/b/lostnfound-7c21c.appspot.com/o/github-readme%2Fimage1.png?alt=media&token=6adcfaca-74e6-48e5-b037-3a6195294069)
    <span>
   <span>

1.  **Chats**
    1.  **Users can only chat with users only if claim request is accepted**
        ![approve](https://firebasestorage.googleapis.com/v0/b/lostnfound-7c21c.appspot.com/o/github-readme%2Fimage10.png?alt=media&token=912b8c0b-29a3-4b2c-84d7-b0553b28255d)
    2.  **Founder can approve the user as owner after chatting**
      ![approve](https://firebasestorage.googleapis.com/v0/b/lostnfound-7c21c.appspot.com/o/github-readme%2Fimage14.png?alt=media&token=8753b2ed-167f-441a-837d-42ae94fbbaae)
    3.  **Owner confirming the return of item**
        <span>
        Requested user can only see confirm return button, when founder approves the requester as owner
        ![return](https://firebasestorage.googleapis.com/v0/b/lostnfound-7c21c.appspot.com/o/github-readme%2Fimage15.png?alt=media&token=1038d1e1-6736-49f3-8c2f-2db889e53576)

        ![returnMsg](https://firebasestorage.googleapis.com/v0/b/lostnfound-7c21c.appspot.com/o/github-readme%2Fimage2.png?alt=media&token=1e089beb-bc82-48ab-8ce7-c7050e9cfd2e)
    <span>
   <span>

2.  **Founder receiving reward**
    <span>
    Once the owner confirms the return of item, founder will receive reward
    ![rewards](https://firebasestorage.googleapis.com/v0/b/lostnfound-7c21c.appspot.com/o/github-readme%2Fimage7.png?alt=media&token=530e7679-af20-42fc-aa96-33b4d4343837)
    <span>
   <span>


---


## Test Coverage



- Class Coverage: 96% (24/25)
- Method Coverage: 95% (134/141)
- Line Coverage: 96% (353/367)

![coverage-img](https://firebasestorage.googleapis.com/v0/b/lostnfound-7c21c.appspot.com/o/github-readme%2Ftest_coverage.png?alt=media&token=f761e61f-a0b1-4c0f-b17d-07d131ebe802)



---


## Contributors

Meet the team behind the **Lost and Found** project:

1. **Heramb Kulkarni**
   <img src="https://cdn-icons-png.flaticon.com/512/6711/6711567.png" alt="React" height="20"> **heramb.kulkarni@dal.ca**
  <img src="https://icons.iconarchive.com/icons/limav/flat-gradient-social/512/Linkedin-icon.png" alt="React" height="20"> [Heramb Kulkarni](https://www.linkedin.com/in/heramb-kulkarni-8bb735193)

2. **Angel Christian**
   <img src="https://cdn-icons-png.flaticon.com/512/6711/6711567.png" alt="React" height="20"> **angel.christian@dal.ca**
  <img src="https://icons.iconarchive.com/icons/limav/flat-gradient-social/512/Linkedin-icon.png" alt="React" height="20"> [Angel Christian](https://www.linkedin.com/in/angel-christian25/)

3. **Aman Desai**
   <img src="https://cdn-icons-png.flaticon.com/512/6711/6711567.png" alt="React" height="20"> **amandesai@dal.ca**
  <img src="https://icons.iconarchive.com/icons/limav/flat-gradient-social/512/Linkedin-icon.png" alt="React" height="20"> [Aman Desai](https://www.linkedin.com/in/AmanDesai10/)

4. **Harsh Mehta**
   <img src="https://cdn-icons-png.flaticon.com/512/6711/6711567.png" alt="React" height="20"> **hr699843@dal.ca**
  <img src="https://icons.iconarchive.com/icons/limav/flat-gradient-social/512/Linkedin-icon.png" alt="React" height="20"> [Harsh Mehta](https://www.linkedin.com/in/harsh-mehta-414628168/)

5. **Tirth Bharatiya**
   <img src="https://cdn-icons-png.flaticon.com/512/6711/6711567.png" alt="React" height="20"> **tr608606@dal.ca**
  <img src="https://icons.iconarchive.com/icons/limav/flat-gradient-social/512/Linkedin-icon.png" alt="React" height="20"> [Tirth Bharatiya](https://www.linkedin.com/in/tirth1/)


