describe("Progress bar " , () => {
    beforeEach(() => {
        cy.login("user_name", "user_password");
      });
   it("view how much of yearly donation  goal has been met", () => {
    
    cy.wait(1000)
    cy.get('.CustomProgressBar_progressBar__b-74h').invoke('text')
    cy.get('.CustomProgressBar_donationInfo__2FYuE')
  .invoke('text')
  .then((text) => {
    const currentAmount = text.match(/£(\d+\.\d+)/)[1];
    const goalAmount = text.match(/£(\d+\.\d+) donated/)[1];
    const percentage = (parseFloat(currentAmount) / parseFloat(goalAmount)) * 100;
    cy.log(percentage); // logs the percentage
    cy.get('.CustomProgressBar_progressText__pOX03').should('contain', percentage);

  });
   })
})