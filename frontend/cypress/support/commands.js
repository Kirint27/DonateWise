Cypress.Commands.add("login", () => {
    // Visit the host URL
    cy.visit(Cypress.env("host"), {
     
      timeout: 300000
    });
    // Wait for the login form to be visible
  
  
    // Type in the email field and assert the value
    cy.get("input").filter("[type='email']")
      .type(Cypress.env("user_name"))
      .should("have.value", Cypress.env("user_name"));
  
  
    // Type in the password field
    cy.get("input").filter("[type='password']")
      .type(Cypress.env("password") || "defaultPassword");
  
    // Click the submit button and assert that you are redirected or the expected outcome occurs
    cy.get('.login_primaryButton__az94B').click();    cy.url().should("include", "/dashboard");
    // Assert that the dashboard is visible}
  });  