describe("rest passsword", () => {
    beforeEach(() => {
      cy.visit(Cypress.env("host"));
    });
    it('should allow you to send email to reset password', () => {
      
    
        cy.get('a').contains('Forgot Password').click();
        cy.get('input[name="email"]').type('kirinthapar@yandex.com')

        cy.get('button').click();
    })
})
