describe("rest passsword", () => {
    beforeEach(() => {
        cy.login("user_name", "user_password");
    });
    it('should allow you to cancel  a  monthly donation', () => {
        cy.get('.Navbar_navbarList__i62SP > :nth-child(2)').contains('Tax-Reporting ').click();

        cy.get('tbody > :nth-child(2) > :nth-child(5)').should('contain.text','monthly')
        cy.get('.TaxReporting_section__5hh-j > :nth-child(4) > .TaxReporting_tableWrapper__h8nv1 > table > tbody > :nth-child(1) > :nth-child(6) > button')  .should('be.disabled');
                cy.get('tbody > :nth-child(2) > :nth-child(6) > .TaxReporting_disabledButton__OXaab').should('have.css', 'background-color', 'rgb(204, 204, 204)').should('have.text', 'Cancel')
    })    
})