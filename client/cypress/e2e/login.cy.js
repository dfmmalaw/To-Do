describe("Login", () => {
  it("should successfully log into our app", () => {
    cy.visit("http://localhost:3000/auth/login");
    cy.get("button[data-testid=submit]").click();

    // Login on Auth0.
    cy.origin(
      Cypress.env("auth_domain"),
      {
        args: {
          username: Cypress.env("auth_username"),
          password: Cypress.env("auth_password"),
        },
      },
      ({ username, password }) => {
        cy.get("input#username").type(username);
        cy.get("input#password").type(password, { log: false });
        cy.contains("button[value=default]", "Continue").click();
      }
    );

    cy.url().should("equal", "http://localhost:3000/user/tasks");
  });
});
