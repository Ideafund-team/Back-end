# Use an official Node.js runtime as the base image
FROM node:20

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle the app source inside the Docker image
COPY .env ./

COPY . .

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Define the command to run the app
CMD [ "npm", "run", "start" ]