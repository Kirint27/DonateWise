describe("Manually add donation " , () => {
    beforeEach(() => {
        cy.login("user_name", "user_password");
      });
   it("Manually add previous donations", () => {
  cy.get('button').contains('Add Donation').click();
  cy.get('[name="charityName"]').type('Parkinsons UK')
  cy.get('[name="donationAmount"]').type('100');

  cy.get('[name="donationDate"]').type('2025-01-10')
  cy.get('[name="donationType"]').select('One-time');
  cy.get('[name="paymentMethod"]').select('Credit Card');
  cy.get('[type="submit"]').contains('Add Donation').click();
  cy.contains('Donation added successfully').should('be.visible');

})
    
    
    })