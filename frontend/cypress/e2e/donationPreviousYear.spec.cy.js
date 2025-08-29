describe("Previous tax year " , () => {
    beforeEach(() => {
        cy.login("user_name", "user_password");
      });
   it("view donations for previous tax year", () => {
    cy.get('.Navbar_navbarList__i62SP > :nth-child(2)').contains('Donation History').click();
    cy.get('.TaxReporting_mainWrapper__mqyDi > :nth-child(4)')

    .contains('Previous Financial Year')

    .parent()
    .find('table')
    .should('be.visible');
})
    
    
    })