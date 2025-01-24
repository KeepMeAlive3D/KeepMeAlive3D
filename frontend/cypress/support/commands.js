/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }


Cypress.Commands.add("login", (username, password) => {
    cy.session(
        username,
        () => {
            cy.visit('http://localhost:5173/')
            cy.intercept('POST', '/api/login/basic').as('loginRequest');
            cy.get('input[id=username]').type(username);
            cy.get('input[id=password]').type(`${password}{enter}`, {log: false});

            cy.wait('@loginRequest');
        },
        {
            validate: () => {
                cy.window().then((window) => {
                    const token = window.localStorage.getItem("token");
                    expect(token).to.not.be.null;
                    expect(token).to.not.be.empty;
                });
            },
        }
    )
});