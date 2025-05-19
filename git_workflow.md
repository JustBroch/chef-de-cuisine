# 🚀 Git Workflow

This workflow ensures structured collaboration, reduces conflicts, and makes it easy to track team progress.

---

## 🔧 1. Create an Issue for Every Task

-   All work starts with a **GitHub Issue** (e.g., "Implement search endpoint", "Write architecture section").
-   Use labels such as `backend`, `frontend`, `report`, `non-code`, etc.
-   Link issues to the GitHub Project board (Team Planning).

---

## 🌱 2. Create a Feature Branch from `dev`

-   Start a new branch based on `dev`:
    ```bash
    git checkout dev
    git pull origin dev
    git checkout -b feature/short-description
    ```

**Branch naming convention**:

-   `feature/...` for new features
-   `fix/...` for bug fixes
-   `docs/...` for documentation
-   `report/...` for report content
-   Examples: `feature/search-endpoint`, `report/critique-section`

---

## 💻 3. Work on Your Branch

-   Make changes, add files, and test locally.
-   Use meaningful commit messages:
    ```bash
    git add .
    git commit -m "feat: implement search for recipes"
    ```

---

## 🔄 4. Push to GitHub

```bash
git push origin your_branch
```

---

## 🔁 5. Create a Pull Request (PR)

-   On GitHub, create a PR from your branch to `dev`.
-   Link the PR to the corresponding issue using:
    ```
    Closes #42
    ```
-   Write a short summary of what was done in the PR.
-   Request a review from at least one team member.

---

## 🧪 6. Code Review and Approval

-   A reviewer provides feedback or approval.
-   Once approved and tested:
    -   Merge into `dev`
    -   Delete the feature branch if no longer needed

---

## 🧹 7. Update Your Local `dev`

After merging, all team members should update their local branch:

```bash
git checkout dev
git pull origin dev
```

---

## 📌 Best Practices

-   **Never work directly on `dev` or `main`**
-   **Keep pull requests small and focused** – one task per PR
-   **Test locally before pushing**
-   **Track all work using Issues**, so it appears in the project board

---

## 🧭 Summary: Team Git Workflow

| Step              | What to Do                                      |
| ----------------- | ----------------------------------------------- |
| 1. Create Issue   | Describe the task and link it to the project    |
| 2. Create Branch  | From `dev`, with a descriptive name             |
| 3. Implement      | Work on your branch and commit regularly        |
| 4. Push           | Send your code to GitHub                        |
| 5. Pull Request   | Link to issue, request review, merge into `dev` |
| 6. Review & Merge | Approve and merge into `dev`                    |
| 7. Update `dev`   | Pull to keep your local branch up to date       |
