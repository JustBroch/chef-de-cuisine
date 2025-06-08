# Chef de Cuisine Comprehensive API Load Test Documentation

This document describes how to use [k6](https://k6.io/)  
to conduct comprehensive API load and stress testing  
for the Chef de Cuisine backend service.  
The script covers key functionalities such as user registration,  
login, recipe operations, search, filtering, and favorites management.

---

## 1. Purpose of Testing

The main goal of this test is to evaluate the stability and performance  
of the Chef de Cuisine backend APIs under concurrent and complex user actions,  
ensuring all main functions remain reliable, and that the system does not  
crash or produce major errors under load.

---

## 2. Environment Preparation

- Ensure that the backend API service is deployed and accessible.  
  Example cloud address:  
  `http://chefdeCuisine-alb-1272383064.us-east-1.elb.amazonaws.com`

- Install the k6 load testing tool.  
  Recommended installation via npm:  
  ```bash
  npm install -g k6
Or refer to the official documentation.

Make sure your test machine can reach the backend endpoint
(no firewall or network restrictions).

## 3. Script File
Save the complete test script as full_api_test.js.
You can find the script in the project root directory
or copy it from the provided source.

## 4. How to Run
Linux / MacOS ENDPOINT=http://chefdeCuisine-alb-1272383064.us-east-1.elb.amazonaws.com k6 run full_api_test.js

Windows (CMD) 
set ENDPOINT=http://chefdeCuisine-alb-1272383064.us-east-1.elb.amazonaws.com
k6 run full_api_test.js

## 5. Test Scenario Overview
The script defines two main load test scenarios,
which automatically call all major backend APIs:

### 5.1 Registration & Login Flow (registration_login_flow)
Each virtual user (VU) auto-registers a random new account.

Logs in to obtain a JWT token.

Executes recipe listing, creation, search, filtering, and favorites management operations.

Checks the entire user journey and all critical endpoints.

### 5.2 API Stress Flow (api_stress)
Uses a fixed pre-registered test account (e.g., testuser/testpass123).

Simulates multiple users repeatedly calling main APIs at high concurrency.

Evaluates service stability and performance under heavy load.

## 6. Script Structure
registerAndLogin
Automatically registers and logs in a user, returning the JWT token.

recipesCrud
Includes:

Fetching recipes

Creating new recipes

Searching for recipes

Filtering recipes

favoritesCrud
Includes:

Adding a recipe to favorites

Listing favorites

Removing from favorites

userFlow / apiFlow
Main functions for each test scenario.

Metrics & Checks
The script tracks each request’s status, success and failure counts,
and validates responses using assertions.

## 7. Notes and Best Practices
The first registration returns 201 Created.
Subsequent runs may hit 409 User already exists; this is expected.

It is recommended to pre-register the fixed test account (testuser/testpass123)
and make sure it works before running stress tests.

Monitor backend service performance and avoid impacting production environments.

To test additional APIs, simply expand the script with the necessary logic.

## 8. Result Interpretation
k6 will print detailed metrics in the terminal after each run, including:

errors: Number of failed requests

requests_attempted: Total number of attempted requests

success: Successful requests per endpoint

register_fail: Number of registration failures

login_fail: Number of login failures

You can also generate HTML reports or integrate with other k6 reporters for further analysis.

For more advanced usage, refer to the k6 documentation.