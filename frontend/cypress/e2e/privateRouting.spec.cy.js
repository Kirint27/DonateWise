
describe("private routing", () => {
    it("should only allow you to vist login page if you are not logged in", () => {
    cy.visit('http://localhost:3000/dashboard')
    cy.url().should('contain', '/')
    cy.visit('http://localhost:3000/charitySearch')
    cy.url().should('contain', '/')

    });

    it("should allow you to visit all pages once logged in ", () => { 
    cy.visit('http://localhost:3000/')
    cy.get(':nth-child(1) > input').type(Cypress.env("username"));
    cy.get(':nth-child(2) > input').type(Cypress.env("password"));
    cy.get("button[type='submit']").contains('Login').click();
    cy.url().should("contain", "/dashboard");

    cy.visit('http://localhost:3000/charitySearch')
cy.get('ul').get('li').contains('Dashboard').click()
cy.url().should('contain', '/dashboard')

    
    })

});


