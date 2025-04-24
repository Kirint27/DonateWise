describe("charity api search" , () => {
    beforeEach(() => {
        cy.visit(Cypress.env("host"));
        cy.get(':nth-child(1) > input').type(Cypress.env("username"));
        cy.get(':nth-child(2) > input').type(Cypress.env("password"));
        cy.get("button[type='submit']").contains('Login').click();  
    })

    it("should display search bar" , () => {
        cy.get('ul > :nth-child(3)').contains('Charity').click()
        cy.get('.CharitySearch_searchInput__0X-Jc')
   })

   it("should allow you to search for a charity using its name " , () => {
    cy.get('ul > :nth-child(3)').contains('Charity').click()
    cy.get('.CharitySearch_searchInput__0X-Jc').type('Oxfam').get('button').contains("Search").click()
    cy.get(':nth-child(1) > .CharitySearch_charityName__wDoH-').contains('OXFAM')
})
it("should allow you to search for a charity using its location " , () => {
    cy.get('ul > :nth-child(3)').contains('Charity').click()
    cy.get('.CharitySearch_searchInput__0X-Jc').type('York').get('button').contains("Search").click()
    cy.get(':nth-child(2) > .CharitySearch_charityName__wDoH-').contains('York')
})
it("should allow you to search for a charity using cause " , () => {
    cy.get('ul > :nth-child(3)').contains('Charity').click()
    cy.get('.CharitySearch_searchInput__0X-Jc').type('Dog').get('button').contains("Search").click()
    cy.get(':nth-child(1) > .CharitySearch_charityName__wDoH-').contains('dog', { matchCase: false })})

})