Winter-Social-Network App

  - **Version:** 1.0.0
  - **Liscense:** ISC



Table of Contents

#Introduction

  - This project is designed to emulate systems found in apps, such as Facebook and Myspace, where each user has their own personal webpage that dynamically changes based on the content. Users can create an account, upload posts and images, which are then stored in a database to later be displayed on individual profile.



#Installation

To get started with Winter Social Network App, follow these steps:

1. Clone the repository to your local machine:

    - git clone [https://github.com/winter9F/winter-social-network-app](https://github.com/winter9F/winter-social-network-app)

2. Navigate to the project directory:

    - cd winter-social-network-app

3. Install the required dependencies using npm:

    ```
    npm install cloudinary
    npm install connect-flash
    npm install dotenv
    npm install ejs-mate
    npm install express
    npm install express-mongo-sanitize
    npm install express-rate-limit
    npm install express-session
    npm install helmet
    npm install method-override
    npm install mongoose
    npm install multer
    npm install multer-storage-cloudinary
    npm install passport
    npm install passport-local
    npm install passport-local-mongoose
    
    ```

4. Set up and link your Cloudinary:

   - This application uses Cloudinary to store uploaded images. This requires you have a cloudinary account or use a similar service to access this feature. Go to your cloudinary account page. Copy and paste the information listed below into your .env file.

  ```  
  CLOUDINARY_CLOUD_NAME= #####
  CLOUDINARY_KEY = #####
  CLOUDINARY_SECRET = #####

  ```

  [https://cloudinary.com/](https://cloudinary.com/)

5. Start the application:
    
    - Run "node app.js" in your terminal.

6. Open your web browser and visit [http://localhost:3000](http://localhost:3000) to access Winter Social Network App.



#Features

1. Personalized User Profiles

    - Customize your user profile by adding a profile picture, bio, and uploading images and posts. 

2. Content Upload

    - Efficiently store information through post and image uploads, securely saved in a database.

3. Dynamic Profile Updates

    -  Real-time profile changes as each new post or image dynamically influences your user profile.

4. User Authentication

    - Implement secure user authentication, ensuring only authorized users can access their accounts.



#Dependencies

  ```
   - cloudinary: `^1.41.0`
   - connect-flash: `^0.1.1`
   - dotenv: `"16.3.1`
   - ejs-mate: `^4.0.0`
   - express: `^4.18.2`
   - express-mongo-sanitize: `^2.2.0`
   - express-rate-limit: `^7.1.4`
   - express-session: `^1.17.3`
   - helmet: `^7.1.0`
   - method-override: `^3.0.0`
   - mongoose: `^7.6.3`
   - multer: `^1.4.5-lts.1`
   - multer-storage-cloudinary: `^4.0.0`
   - passport: `^0.6.0`
   - passport-local: `^1.0.0`
   - passport-local-mongoose: `^8.0.0`

  ```




