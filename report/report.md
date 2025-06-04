# Chef de Cuisine

## Abstract: Summarise the key points of your document.

## Proposal Changes: Describe and justify any changes made to the project from what was outlined in the proposal.

You can view the original proposal here: https://github.com/CSSE6400/project-proposal-2025/blob/main/s4955583/proposal.md

There were no changes made to the core functionality of the Minimum Viable Product (MVP). The project's focus is to deliver all MVP 
features as planned in the original proposal.

However, after a close review during team discussions, it was identified that many quality attributes lacked sufficient justification or relevance to the goals of the project at its current stage. As a result, the team mutually agreed to refine the quality attributes to include only the three most critical and applicable characterisitics: Availability, Extensibility and Scalability. These attributes were selected based on their direct impact on the system's reliability, long-term adaptibility and capacity to serve users efficiently under varying loads.

The reasons to exclude the other attributes are as follows:

**1. Deployability**

**2. Maintainability**

**3. Modularity**

**4. Reliabilty**

**5. Security**

**6. Testability**

This refinement ensures that the architectural and development decisions remain focused and aligned with the MVP.

## Architecture Options

As a team, we have discussed and investigated different software architectures such as monolithic, layered, microservices, event-driven and serverless. 

**Monolithic**

| Pros | Cons |
| :- | :- |
| Easier to develop, test, and deploy as a single unit. Conceptually simpler. | Can only be scaled as a whole, not by component. |
| In-process calls are faster than inter-service communication. | Small changes may require redeploying the whole system. |
| Easier to set up with common IDEs, debuggers, and profilers. | Becomes very complex and fragile as it grows. |
| Easier to manage ACID transactions across components. | A bug in one part can affect the entire application. |
| Lower running costs on the cloud. | One issue takes the whole system down. |

**Layered (n-tier)**

| Pros | Cons |
| :- | :- |
| Easier to organize code by responsibility (UI, business logic, data access). | Can lead to performance overhead due to multiple abstraction layers. |
| Layers can be reused across different applications. | Hard to skip or bend layers without breaking architecture rules. |
| Logical separation makes the system easier to understand and evolve. | Often implemented as a monolith; all layers tightly coupled in one deployment. |

**Microservices**

| Pros | Cons |
| :- | :- |
| Services can be updated and scaled independently. | Requires complex service orchestration, service discovery, and monitoring. |
| Teams can use different languages or frameworks per service. | Network latency, consistency, and eventual failure handling become critical. |
| Failure in one service is unlikely to crash the entire system. | Transactions across services are hard to implement. |
| Maps well to small, autonomous dev teams. | Requires advanced CI/CD, monitoring, and testing practices to ensure reliability. |

**Event-Driven**

| Pros | Cons |
| :- | :- |
| Services communicate via events, promoting independence. | Hard to trace and debug system behavior across async events. |
| Highly scalable, especially for systems with asynchronous workloads. | Eventual consistency models require careful design. |
| Ideal for streaming data and reactive systems. | More complex to test and simulate event flows and edge cases. |
| Components can operate independently and retry logic can be built in. | Needs reliable messaging infrastructure like RabbitMQ, etc. |

**Serverless**

| Pros | Cons |
| :- | :- |
| Infrastructure handled by cloud provider. | Longer than usual latency during initial function invocation. |
| Functions scale automatically with demand. | Heavy reliance on specific cloud provider APIs and services. |
| Pay only for execution time, not idle compute. | Functions are stateless, requiring external storage for state. |
| Great for prototyping and lightweight services. | Local testing and debugging can be challenging. |

With the selected quality attributes from earlier project planning, a microservices architecture accomodates the given criteria the best as we're prioritising independent scaling, collaborative teamwork for a small team and smoother application operation.

## Architecture: Describe the MVP’s software architecture in detail.

Our application consists of multiple serivces designed to specialise to handle specific functionality independently.

The MVP consists of 3 services:
- Search Service
    - Search recipes by name using keywords or phrases.
- Filter Service
    - Search recipes using recipe attributes (ingredients list, rating, cooking time, etc.).
- User Service
    - Manage user details, preferences and favourite recipes.

Services communicate to one another synchronously using the RESTAPI framework over HTTP. For this application, requests are simpler and a single request doesn't place high loads on the system. The backend REST API is written in Python using Flask, PostgreSQL as our database and Docker for containerisation. The frontend UI elements are written in TypeScript. Using AWS ECS (Fargate) and ECR, we deployed each service as a docker image to the cloud. AWS autoscaling with an application load balancer (ALB) handles the balance between resource usage and site traffic. Each service scales independently to cater for it's own load.

Authentication is handled using a JWT token across services for accessing the API in a secure manner to ensure user-entered data is well-formed and the intent is not malicious. During use, if a service becomes unhealthy for an unknown reason, it will attempt to restart which may take some time (in the order of minutes). All actions are monitored and logged using AWS CloudWatch with alarms for scaling purposes.

There are 2 PostgreSQL databases, one for recipes and the other for users. Keeping the databases separate allows each service to only access the information it requires. If a service becomes unhealthy, it reduces the likelihood of data becoming lost which may result in frustration from the user and a poor user experience.

**Architecture Diagram**

![alt text](architecture_diagram.png)

**Component Diagram**

![alt text](component_diagram.png)

## Trade-Offs: Describe and justify the trade-offs made in designing the architecture.

## Critique: Describe how well the architecture supports delivering the complete system.

## Evaluation: Summarise testing results and justify how well the software achieves its quality attributes.

## Reflection: Lessons learnt and what you would do differently.
