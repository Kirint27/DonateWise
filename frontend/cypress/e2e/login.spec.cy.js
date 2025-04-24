describe("Login tests", () => {
    beforeEach(() => {
      cy.visit(Cypress.env("host"));
    });
  
   

  it("should display login form", () => {
    cy.get("form").should("be.visible");
    cy.get(':nth-child(1) > label').contains("Email").should("be.visible");
    cy.get(':nth-child(2) > label').contains("Password").should("be.visible");
    cy.get("button[type='submit']").should("be.visible");
  });



it("should allow user to login with valid credentials and logout" , () => {
    cy.get(':nth-child(1) > input').type(Cypress.env("username"));
    cy.get(':nth-child(2) > input').type(Cypress.env("password"));
    cy.get("button[type='submit']").contains('Login').click();
    cy.url().should("contain", "/dashboard");
cy.get('button').contains('Logout').click()

});



it("should display error message when using invalid email" , () => {
    cy.get(':nth-child(1) > input').type("kirin@gmail.com");
    cy.get(':nth-child(2) > input').type(Cypress.env("password"));
    cy.get("button[type='submit']").contains('Login').click();
cy.get('p').contains('Wrong email or password')

});
it("should display error message when using invalid password" , () => {
    cy.get(':nth-child(1) > input').type(Cypress.env("username"));
    cy.get(':nth-child(2) > input').type('Password98');
    cy.get("button[type='submit']").contains('Login').click();
cy.get('p').contains('Wrong email or password')

});


});
