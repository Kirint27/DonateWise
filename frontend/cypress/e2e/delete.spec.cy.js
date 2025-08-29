describe("rest passsword", () => {
    beforeEach(() => {
        cy.login("user_name", "user_password");
    });
    it('should allow you to delete a  one time donation', () => {
        cy.get('.Navbar_navbarList__i62SP > :nth-child(2)').contains('Tax-Reporting ').click();

        cy.get('.Navbar_navbarList__i62SP > :nth-child(2)').should('not.contain.text','monthly')
        cy.get('.TaxReporting_section__5hh-j > :nth-child(4) > .TaxReporting_tableWrapper__h8nv1 > table > tbody > :nth-child(1) > :nth-child(6) > button').contains('Delete').click();
    })    
})