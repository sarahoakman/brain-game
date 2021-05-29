describe('Registering user', () => {
  describe('unsuccessfully', () => {
      // make sure you reset the db manually by typing yarn reset and yarn start in terminal
      // cy.exec('cd ../backend && yarn reset && yarn start')
    it('displays error message validating email', () => {
      // seed a user in the DB that we can control from our tests
      cy.request({
        method: 'POST',
        url: 'http://localhost:5005/admin/auth/register',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: {
          name: 'Jane',
          password: 'password123',
          email: 'janelane@gmail.com'
        },
      }).then(
        (response) => {
        // response.body is automatically serialized into JSON
        expect(response.status).to.eq(200);
        let token = response.body.token;
          cy.request({ // logging out so we can log in via cypress
              method: 'POST',
              url: 'http://localhost:5005/admin/auth/logout',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
              },
            }).then(
              (response) => {
              // response.body is automatically serialized into JSON
              expect(response.status).to.eq(200);
              })
        })

      cy.visit('http://localhost:3000/signup')
      // jane is not a valid email address
      cy.get('input[name=email]').type("jane");
      cy.get('input[name=email]').should('have.attr', 'aria-invalid')
      .and('equal', 'true');
      cy.get('#email-helper-text').should('be.visible')
      cy.get('#submitSignup').should('have.attr', 'disabled')
    })
    it('email error message goes away when fixed', () => {
      cy.get('input[name=email]').clear();
      cy.get('input[name=email]').type("janelane@gmail.com");
      cy.get('input[name=email]').should('have.attr', 'aria-invalid')
      .and('equal', 'false');
      cy.get('#email-helper-text').should('not.exist');
    })
    it('displays error message when password field is empty ', () => {
      cy.get('input[name=password]').type("pass");
      cy.get('input[name=password]').clear()      //clear text field
      cy.get('input[name=password]').should('have.attr', 'aria-invalid')
      .and('equal', 'true');
      cy.get('#password-helper-text').should('be.visible');
    })
    it('password error message goes away when fixed', () => {
      cy.get('input[name=password]').type("pass");
      cy.get('input[name=password]').should('have.attr', 'aria-invalid')
      .and('equal', 'false');
      cy.get('#password-helper-text').should('not.exist');
    })
    it('displays error message when name field is empty ', () => {
      cy.get('input[name=name]').type("Jane");
      cy.get('input[name=name]').clear()      //clear text field
      cy.get('input[name=name]').should('have.attr', 'aria-invalid')
      .and('equal', 'true');
      cy.get('#name-helper-text').should('be.visible');
    })
    it('name error message goes away when fixed ', () => {
      cy.get('input[name=name]').type("Jane");
      cy.get('input[name=name]').should('have.attr', 'aria-invalid')
      .and('equal', 'false');
      cy.get('#name-helper-text').should('not.exist');
      cy.get('#submitSignup').should('not.have.attr', 'disabled');
    })
    it('displays error message when user exists ', () => {
      cy.get('input[name=name]').type(`{enter}`) //submit form
      cy.get('.MuiAlert-message').should('be.visible');
    })
  })
})

describe('Login User', () => {
  describe('trying to log in with incorrect details', () => {
    it('navigate to login page from register', () => {
      cy.get('#navToLogin').click() // Click on button
      cy.location('pathname').should('eq', '/login')
    })
    it('login button isnt able to be clicked until all fields filled out', () => {
      cy.get('input[name=email]').type("janelane@gmail.com");
      cy.get('input[name=password]').type("wrongpassword");
    })
    it('error message with invalid password/username', () => {
      cy.get('input[name=password]').type(`{enter}`) //submit form
      cy.get('.MuiAlert-message').should('be.visible');
    })
  })
  describe('log in successfully', () => {
    it('navigates to dashboard', () => {
      cy.get('input[name=password]').clear();
      cy.get('input[name=password]').type("pass"); //known bug with api in ed forum password changes anyways
      cy.get('input[name=password]').type(`{enter}`) //submit form
      cy.location('pathname').should('eq', '/dashboard')
      cy.request({ // log in
        method: 'POST',
        url: 'http://localhost:5005/admin/auth/login',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: {
          password: 'pass',
          email: 'janelane@gmail.com'
        },
      }).then(
        (response) => {
        // response.body is automatically serialized into JSON
        expect(response.status).to.eq(200);
        window.localStorage.setItem('token', response.body.token)
      })
    })
  })
})

describe('Adding and deleting a game', () => {
  describe('adding a game', () => {
    it('press new game button', () => {
      cy.get('button[aria-label=add-game-button]').click()
    })
    it('input game name', () => {
      cy.get('input[id=game-name]').type("new");
    })
    it('delete game name', () => {
      cy.get('input[id=game-name]').clear();
    })
    it('game name is empty shows error', () => {
      cy.get('.Mui-error').should('be.visible');
    })
    it('input game name', () => {
      cy.get('input[id=game-name]').type("new");
    })
    it('press add game button', () => {
      cy.get('button[id=add-game]').click();
    })
    it('game should show on dashboard', () => {
      cy.get('#new').should('be.visible');
    })
  })
 describe('deleting a game', () => {
    it('press delete game button', () => {
      cy.get('svg[aria-label=delete]').click()
    })
    it('game should disappear from dashboard', () => {
      cy.get('#new').should('not.exist');
    })
  })
})

describe('Joining a game', () => {
  describe('unsuccessfully', () => {
    it('press join game button', () => {
      cy.get('#joinGame').click()
      cy.location('pathname').should('eq', '/join')
    })
    it('try to enter with empty fields', () => {
      cy.get('#enterGame').click()
      cy.get('.MuiAlert-message').should('be.visible');
      cy.get('.MuiAlert-message').should('be.visible').should('have.text',"Error! Fix up empty inputs to join the game")
    })
    it('try to enter with invalid session id', () => {
      cy.get('input[name=pin]').type("111111");
      cy.get('input[name=name]').type("Jane");
      cy.get('input[name=name]').type(`{enter}`) //submit form
      cy.get('.MuiAlert-message').should('be.visible');
      cy.get('.MuiAlert-message').should('be.visible').should('have.text',"Error! Session ID is not an active session")
    })
  })
})

describe('Return to dashboard', () => {
  it('go back to dashboard', () => {
    cy.go('back');
    cy.location('pathname').should('eq', '/dashboard')
  })
})
