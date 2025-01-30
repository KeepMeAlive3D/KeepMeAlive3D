Cypress.Commands.add("login", (username, password) => {
  cy.session(
    username,
    () => {
      cy.visit("http://localhost:5173/");
      cy.intercept("POST", "/api/login/basic").as("loginRequest");
      cy.get("input[id=username]").type(username);
      cy.get("input[id=password]").type(`${password}{enter}`, { log: false });

      cy.wait("@loginRequest");
    },
    {
      validate: () => {
        cy.window().then((window) => {
          const token = window.localStorage.getItem("token");
          expect(token).to.not.be.null;
          expect(token).to.not.be.empty;
        });
      },
    },
  );
});
