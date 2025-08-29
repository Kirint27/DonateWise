describe("current tax year " , () => {
    beforeEach(() => {
        cy.login("user_name", "user_password");
      });
   it("view donations for current tax year", () => {
    cy.get('.Navbar_navbarList__i62SP > :nth-child(2)').contains('Donation History').click();
    cy.get('.TaxReporting_section__5hh-j')

    .contains('Current Financial Year')

    .parent()
    .find('table')
    .should('be.visible');
})
    
    
    })