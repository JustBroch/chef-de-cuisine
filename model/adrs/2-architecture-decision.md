# 2. Selection of Architecture

Date: 2025-06-02

Status: Accepted

## Summary

We decided to use a microservices architecture for this project rather than a layered, monolithic or serverless architecture.

## Context

Our application, Chef de Cuisine is an intelligent cooking assistant for users of all skill levels from beginners to professionals. As availability is one of the most important attributes, we are fully prioritising the user experience and front-end design to cater to a large audience/demographic.

Through the lectures, we have learnt about the benefits and drawbacks of different software architectures and have considered these greatly when deciding what architecture to move forward with.

## Decision

We have decided to go forward with the microservices architecture for the following reasons:

When a service becomes unavailable, it won't take down the entire system with it. The malfunctioning service will take a short moment to refresh itself and will become online again. Other services operate independently and aren't affected by the malfunctioning service. This makes our application more available especially during peak traffic such as lunch and dinner where most individuals and families are preparing meals.

For our system to become more personalised, the application requires a certain amount of modularity to enable future development of new features such as recipe recommendations and comparisons. The new features should not affect the operation and functionality of existing features. A modular architecture is most definitely required.

During peak hours, we can scale our services independently. Some features such as search are likely to have more traffic than managing user profile for example. We can allocate more resources to search so users can access the recipe database without buffering or the system slowing down.

## Consequences

**Advantages**

All team members understand how a microservices architecture works from lectures earlier in the semester and although it's more complex at the start, it allows the scaling element to be easier to develop over the course of the project.

**Disadvanatages**

A microservices architecture takes a bit longer to get started and running correctly. Communication is heavily required to coordinate teamwork around the different services we are implementing.