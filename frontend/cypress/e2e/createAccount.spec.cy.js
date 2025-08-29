describe("account", () => {
    beforeEach(() => {
      cy.visit(Cypress.env("host"));
    });
      it('should go to register page', () =>{
        cy.get('button').contains ('Create Account').click()
      })

    //   it('the form should submit correctly once all required fields are filled in ',() => {
    //     cy.get('button').contains ('Create Account').click()
    //     cy.get('form').within(() => {
    //         cy.get('input[type="text"]').eq(0).type('John Doe');
    //         cy.get('input[type="email"]').eq(0).type('john.doe@example.com');
    //         cy.get('input[type="password"]').eq(0).type('password123');
    //         cy.get('input[type="password"]').eq(1).type('password123');
    //         cy.get('input[type="number"]').type('50000');
          
    //         // Check 'Gift Aid' checkbox (ensure no extra space in name attribute)
          
    //         // Only tick 3 specific causes
    //         cy.get('input[type="checkbox"][name="causes"][value="health-medical"]').check();
    //         cy.get('input[type="checkbox"][name="causes"][value="children-education"]').check();
    //         cy.get('input[type="checkbox"][name="causes"][value="environment-sustainability"]').check();
          
    //     })    // Submit the form
    //         cy.get('form').submit();
        
    //       });
        
    //   it('the form should not  submit if you are missing any required fields ',() => {
    //     cy.get('button').contains ('Create Account').click()
    //     cy.get('form').within(() => {
    //         cy.get('input[type="text"]').eq(0).type('John Doe');
    //         cy.get('input[type="email"]').eq(0).type('john.doe@example.com');
    //         cy.get('input[type="password"]').eq(0).type('password123');
    //         cy.get('input[type="password"]').eq(1).type('password123');
          
    //         // Check 'Gift Aid' checkbox (ensure no extra space in name attribute)
          
    //         // Only tick 3 specific causes
    //         cy.get('input[type="checkbox"][name="causes"][value="health-medical"]').check();
    //         cy.get('input[type="checkbox"][name="causes"][value="children-education"]').check();
    //         cy.get('input[type="checkbox"][name="causes"][value="environment-sustainability"]').check();
    //     })    // Submit the form
    //     cy.get('form').submit();
    
    //   });
    //    // Submit the form
    
        
    //     it('the form should not  submit if email is not correct',() => {
    //         cy.get('button').contains ('Create Account').click()
    //         cy.get('form').within(() => {
    //             cy.get('input[type="text"]').eq(0).type('John Doe');
    //             cy.get('input[type="email"]').eq(0).type('john.doe.example.com');
    //             cy.get('input[type="password"]').eq(0).type('password123');
    //             cy.get('input[type="password"]').eq(1).type('password123');
    //             cy.get('input[type="number"]').type('50000');

    //             // Check 'Gift Aid' checkbox (ensure no extra space in name attribute)
              
    //             // Only tick 3 specific causes
    //             cy.get('input[type="checkbox"][name="causes"][value="health-medical"]').check();
    //             cy.get('input[type="checkbox"][name="causes"][value="children-education"]').check();
    //             cy.get('input[type="checkbox"][name="causes"][value="environment-sustainability"]').check();
    //         })    // Submit the form
    //         cy.get('form').submit();
        
    //       });

          it('the form should not  submit if email is not correct',() => {
            cy.get('button').contains ('Create Account').click()
            cy.get('form').within(() => {
                cy.get('input[type="text"]').eq(0).type('John Doe');
                cy.get('input[type="email"]').eq(0).type('johnSmith.@test.com');
                cy.get('input[type="password"]').eq(0).type('password124');
                cy.get('input[type="password"]').eq(1).type('password124');
                cy.get('input[type="number"]').type('50000');

                // Check 'Gift Aid' checkbox (ensure no extra space in name attribute)
              
                // Only tick 3 specific causes
                cy.get('input[type="checkbox"][name="causes"][value="health-medical"]').check();
                cy.get('input[type="checkbox"][name="causes"][value="children-education"]').check();
                cy.get('input[type="checkbox"][name="causes"][value="environment-sustainability"]').check();
            })    // Submit the form
            cy.get('form').submit();
        
          });
})