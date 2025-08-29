describe("Get gaol amount " , () => {
    beforeEach(() => {
        cy.login("user_name", "user_password");
      });
   it("view goal amount", () => {
    cy.wait(1000)
cy.get('div').contains('Goal: ').invoke('text')
   })
})