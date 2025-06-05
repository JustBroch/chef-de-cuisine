# 3. Adjusting the Proposal

Date: 2025-06-02

Status: Accepted

## Summary

The proposal had too many elements for a project to fit inside a 1 month timeframe. Some adjustments needed to be made as we prioritised quality > quantity for our minimum viable product (MVP).

## Context

With a limited timeframe, we had to collectively decide as a team what features and elements would be built for final submission. Some features were out of scope for this course (such as AI enhanced features like recommendation systems) and other features listed in the proposal were optional. Those would be attempted if the time allows.

## Decision

We decided to cull some of the filter options from the proposal like spice level and cuisine types since the dataset we're using doesn't have those attributes and would present more challenges regarding data consistency and application responsiveness. The remaining filter options included in our application are selection of ingredients, recipe name, recipe rating and time constraints.

The recommender systems (or anything ML related) was removed due to being out of scope in this course (which focuses on software architecture, not ML). We did not replace this feature with anything as the MVP aims to cover the core components.

Some of the technical aspects of profile management such as commenting and posting on recipes were removed for our MVP as they're more of an optional feature.

## Consequences

**Advantages**

Each feature can have more attention and time towards it leading to higher quality and less bugs. By focusing on core components, we're able to deliver a better user experience rather than focusing on extra, non-essential components (such as recommender systems).

**Disadvantages**

Our application is on the basic side but demonstrates intended functionality and usual application operation regardless.