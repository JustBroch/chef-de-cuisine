# 4. Modification to Architecture

Date: 2025-06-07

Status: Accepted

## Summary

We decided to implement one microservice combining the functions of the three previously proposed microservices in the initial design due to time constraints and minimal adverse consequences.

## Context

Our application, Chef de Cuisine is an intelligent cooking assistant for users of all skill levels from beginners to professionals. As availability is one of the most important attributes, we are fully prioritising the user experience and front-end design to cater to a large audience/demographic.

Through the lectures, we have learnt about the benefits and drawbacks of different software architectures and have considered these greatly when deciding what architecture to move forward with.

## Decision

We have decided to go with one microservice initially due to following reasons:

- Simpler to build with limited time and resources and little adverse effects.

- The microservice is designed so it can easily be split up in the future into multiple microservices.

- Few adverse consequences of the decision.

## Consequences

**Advantages**

Simpler and quicker to build one microservice with one database.

**Disadvanatages**

- Cannot scale microservices independently if demand for one particular service is greater though in initial stages demand will probably be limited.

- If microservice goes down, could cause increased loss of availability but we would have several instances running so this is unlikely. 
