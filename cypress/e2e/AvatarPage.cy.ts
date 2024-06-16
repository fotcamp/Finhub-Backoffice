describe('아바타 목록 페이지', () => {
  beforeEach(() => {
    // given
    cy.login(Cypress.env('ADMIN_EMAIL'), Cypress.env('ADMIN_PASSWORD'));
    cy.intercept(
      {
        method: 'GET',
        url: `${Cypress.env('VITE_API_BASE_URL')}/api/v1/admin/user-avatar`,
      },
      { fixture: '/AvatarPage/avatars.json' },
    ).as('/avatars');
    cy.visit(`${Cypress.env('TEST_BASE_URL')}/services/avatars`);
  });

  it('목록페이지에는 8개의 목록이 노출됩니다.', () => {
    // when + then
    cy.wait('@/avatars');
    cy.get('[data-testid=avatar]').should('have.length', 8);
  });

  it('아바타 이미지를 클릭하면 팝업이 노출되고 확인을 누르면 "반영되었습니다." 토스트 노출 후 목록이 갱신됩니다.', () => {
    // given
    cy.intercept(
      'DELETE',
      `${Cypress.env('VITE_API_BASE_URL')}/api/v1/admin/avatar`,
      {
        statusCode: 200,
      },
    ).as('/avatar/delete');

    cy.intercept(
      {
        method: 'GET',
        url: `${Cypress.env('VITE_API_BASE_URL')}/api/v1/admin/user-avatar`,
      },
      { fixture: '/AvatarPage/avatars_delete.json' },
    ).as('/avatars_delete');

    // when
    cy.get('[data-testid=avatar]').first().click();
    cy.on('window:confirm', () => true);
    cy.wait('@/avatar/delete');

    // then
    cy.contains('.ant-message-notice-content', '반영되었습니다.');
    cy.wait('@/avatars_delete');
    cy.get('[data-testid=avatar]').should('have.length', 7);
    cy.get('[data-testid=avatar]').each((el) => {
      expect(el).to.not.have.attr(
        'src',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
      );
    });
  });
});

describe('아바타 추가 모달', () => {
  beforeEach(() => {
    // given
    cy.login(Cypress.env('ADMIN_EMAIL'), Cypress.env('ADMIN_PASSWORD'));
    cy.intercept(
      {
        method: 'GET',
        url: `${Cypress.env('VITE_API_BASE_URL')}/api/v1/admin/user-avatar`,
      },
      { fixture: '/AvatarPage/avatars.json' },
    ).as('/avatars');
    cy.visit(`${Cypress.env('TEST_BASE_URL')}/services/avatars`);
  });

  it('아바타 추가 버튼을 클릭하면 모달이 노출됩니다.', () => {
    // when
    cy.contains('button', '아바타 추가').click();

    // then
    cy.get('[data-testid=avatar-uploader-modal] .ant-modal-wrap').should(
      'be.visible',
    );
  });

  it('모달에 이미지를 업로드 하지않고 확인을 누르면 "이미지를 업로드 해주세요." 토스트가 노출됩니다.', () => {
    // when
    cy.contains('button', '아바타 추가').click();
    cy.contains(
      '[data-testid=avatar-uploader-modal] .ant-modal-wrap button',
      '확인',
    ).click();

    // then
    cy.contains('.ant-message-notice-content', '이미지를 업로드 해주세요.');
  });

  it('모달에 이미지를 업로드 후 확인을 누르면 "반영되었습니다." 토스트가 노출되고 모달이 닫힌 후 목록이 갱신됩니다.', () => {
    //given
    cy.intercept(
      'POST',
      `${Cypress.env('VITE_API_BASE_URL')}/api/v1/admin/user-avatar`,
      {
        statusCode: 200,
      },
    ).as('/avatar/create');

    cy.intercept(
      {
        method: 'GET',
        url: `${Cypress.env('VITE_API_BASE_URL')}/api/v1/admin/user-avatar`,
      },
      { fixture: '/AvatarPage/avatars.json' },
    ).as('/avatars');

    // when
    cy.contains('button', '아바타 추가').click();
    cy.get('[data-testid=avatar-uploader-modal] .ant-modal-wrap').should(
      'be.visible',
    );
    cy.get('[data-testid=avatar-uploader-modal] .ant-modal-wrap label').should(
      'be.visible',
    );
    cy.get('input[type="file"]').selectFile('cypress/fixtures/logo.png', {
      force: true,
    });
    cy.contains(
      '[data-testid=avatar-uploader-modal] .ant-modal-wrap button',
      '확인',
    ).click();

    // then
    cy.wait('@/avatar/create');
    cy.contains('.ant-message-notice-content', '반영되었습니다');
  });
});
