import axios from "axios";

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

Cypress.Commands.add("deleteCurrentUser", () => {
  cy.window().then((win) => {
    const token = win.localStorage.getItem("token");

    if (!token) {
      console.warn("Ignore deletion of current user as token is null");
    }

    console.debug("Deleting user with token" + token);

    const options = {
      method: "DELETE",
      url: "http://localhost:8080/api/user",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `bearer ${token}`,
      },
    };

    axios
      .request(options)
      .then(function(response) {
        console.log("Deleted current user");
      })
      .catch(function(error) {
        console.error(error);
      });
  });
});
