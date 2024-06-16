/// <reference types="cypress" />

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.intercept({
    method: 'POST',
    url: `${Cypress.env('VITE_API_BASE_URL')}/api/v1/admin/login`,
    headers: {
      'Content-Type': 'application/json',
      finhub: Cypress.env('VITE_API_API_KEY'),
    },
  }).as('login');

  cy.visit('http://localhost:3000');
  cy.get('[data-testid=input-email]').type(email);
  cy.get('[data-testid=input-password]').type(password);
  cy.get('form').submit();
  cy.wait('@login');
});
