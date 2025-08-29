describe("Update account  " , () => {
    beforeEach(() => {
        cy.visit(Cypress.env("host"));
        cy.get(':nth-child(1) > input').type(Cypress.env("username"));
        cy.get(':nth-child(2) > input').type(Cypress.env("password"));
        cy.get("button[type='submit']").contains('Login').click();  
    })
    it("should allow you to update any field in account using form" , () => {
        cy.get('.Navbar_iconText__zdpO5').click()
        cy.wait(1000)
            cy.get('input[name="fullName"]').type('New User')
    cy.get('button').contains('Save Changes').click();
    cy.wait(1000)
cy.url().should("contain", "/dashboard");
    });
});