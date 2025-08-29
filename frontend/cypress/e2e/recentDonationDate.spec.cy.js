describe("Recent donations ", () => {
  beforeEach(() => {
    cy.login("user_name", "user_password");
  });
  it("the 3 most recent donations should be displayed in date order from left to right, with the left being the most recent", () => {
    cy.get(".Dashboard_donationItem__7X9XU");
    cy.get(".Dashboard_date__PJGPs")
      .eq(0)
      .invoke("text")
      .then((currentDate) => {
        const [day, month, year] = currentDate.split("/");
        const currentDateObj = new Date(year, month - 1, day);
        cy.get(".Dashboard_date__PJGPs")
          .eq(1)
          .invoke("text")
          .then((nextDate) => {
            const [nextDay, nextMonth, nextYear] = nextDate.split("/");
            const nextDateObj = new Date(nextYear, nextMonth - 1, nextDay);
            console.log(
              `First check result: ${currentDateObj.getDate()}/${
                currentDateObj.getMonth() + 1
              }/${currentDateObj.getFullYear()} is later than ${nextDateObj.getDate()}/${
                nextDateObj.getMonth() + 1
              }/${nextDateObj.getFullYear()}`
            );
          });
      })
      .then(() => {
        cy.get(".Dashboard_date__PJGPs")
          .eq(1)
          .invoke("text")
          .then((currentDate) => {
            const [day, month, year] = currentDate.split("/");
            const currentDateObj = new Date(year, month - 1, day);
            cy.get(".Dashboard_date__PJGPs")
              .eq(2)
              .invoke("text")
              .then((nextDate) => {
                const [nextDay, nextMonth, nextYear] = nextDate.split("/");
                const nextDateObj = new Date(nextYear, nextMonth - 1, nextDay);
                console.log(
                  `Second check result: ${currentDateObj.getDate()}/${
                    currentDateObj.getMonth() + 1
                  }/${currentDateObj.getFullYear()} is later than ${nextDateObj.getDate()}/${
                    nextDateObj.getMonth() + 1
                  }/${nextDateObj.getFullYear()}`
                );
              });
          });
      });
  });
});
