// happy path ui testing
context('Happy path', () => {
	it('Successfully goes through an admin path', () => {
		// successfully registers a new user

		const email = 'hayden@unsw.edu.au';
		const name = 'Harry Jenkins';
		const password = 'adummypassword';

	  cy.visit('localhost:3000/signup');

		cy.get('input[name=email]')
		  .focus()
		  .type(email);

		cy.get('input[name=password]')
		  .focus()
		  .type(password);

		cy.get('input[name=name]')
		  .focus()
		  .type(name);

		cy.get('button[type=submit]')
		  .click();

		// successfully creates a new game

		cy.get('button[aria-label=add-game-button]')
		  .click();

		cy.get('input[id=game-name]')
		  .focus()
		  .type('Game Title');

		cy.get('button[id=add-game]')
		  .click();

		cy.get('h2[aria-label=game-name]').then(el => {
			expect(el.text()).to.equal('Game Title')
		});

		// successfully updates a game name
	  const newGameName = 'New Game Title';

		cy.get('svg[aria-label=edit]')
		  .click();

		cy.get('div[id=title-header]')
		  .click();

		cy.get('input[name=title]')
		  .focus()
		  .clear()
		  .type(newGameName);

		cy.get('label[aria-label=submit-edit]')
		  .click();

    cy.get('.MuiAlert-standardSuccess')
      .should('be.visible');

		cy.get('button[aria-label=dashboard]')
		  .click();

		cy.get('h2[aria-label=game-name]').then(el => {
			expect(el.text()).to.equal(newGameName)
		});

		// successfully starts a game

		cy.get('svg[aria-label=play]')
		  .click();

		cy.get('button[aria-label=submit-start]')
		  .click();

		// successfully stops a game

		cy.get('svg[aria-label=stop]')
		  .click();

		// successfully loads the result page

		cy.get('button[aria-label=view-results]')
		  .click();

		cy.get('h1[aria-label=result-title]').then(el => {
			expect(el.text()).to.equal('GAME RESULTS')
		});

		// successfully logs out

		cy.get('button[aria-label=logout]')
		  .click();

		// successfully logs back in

		cy.get('input[name=email]')
		  .focus()
		  .type(email);

		cy.get('input[name=password]')
		  .focus()
		  .type(password);

		cy.get('button[type=submit]')
		  .click();

	  // successfully loads dashboard with the game

		cy.get('h1[id=dashboard-title]').then(el => {
			expect(el.text()).to.equal('DASHBOARD')
		});
		
		cy.get('h2[aria-label=game-name]').then(el => {
			expect(el.text()).to.equal('New Game Title')
		});
	});
});
