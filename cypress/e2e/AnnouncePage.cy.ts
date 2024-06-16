describe('공지사항 목록 페이지', () => {
  beforeEach(() => {
    // given
    cy.login(Cypress.env('ADMIN_EMAIL'), Cypress.env('ADMIN_PASSWORD'));
    cy.intercept(
      {
        method: 'GET',
        url: `${Cypress.env('VITE_API_BASE_URL')}/api/v1/admin/announce?page=1&size=10`,
      },
      { fixture: '/AnnouncePage/announce_page_1.json' },
    ).as('/announce?page=1&size=10');
    cy.visit(`${Cypress.env('TEST_BASE_URL')}/services/announces`);
  });

  it('목록페이지에는 10개의 목록이 노출됩니다.', () => {
    // when + then
    cy.wait('@/announce?page=1&size=10');
    cy.get('.ant-table-tbody tr').should('have.length', 10);
  });

  it('목록페이지에서 아래 2페이지를 누르면 다음 페이지 목록이 노출됩니다.', () => {
    // given
    cy.intercept(
      {
        method: 'GET',
        url: `${Cypress.env('VITE_API_BASE_URL')}/api/v1/admin/announce?page=2&size=10`,
      },
      { fixture: '/AnnouncePage/announce_page_2.json' },
    ).as('/announce?page=2&size=10');

    // when
    cy.contains('li', '2').click();
    cy.wait('@/announce?page=2&size=10');
    // then
    cy.get('.ant-table-tbody tr').should('have.length', 10);
  });

  it('목록페이지에서 목록 아이템을 누르면 상세페이지로 이동합니다.', () => {
    // given
    cy.intercept(
      {
        method: 'GET',
        url: `${Cypress.env('VITE_API_BASE_URL')}/api/v1/admin/announce/30`,
      },
      { fixture: '/AnnouncePage/announce.json' },
    ).as('/announce');

    // when
    cy.get('.ant-table-tbody tr').first().click();
    cy.wait('@/announce');
    // then
    cy.url().should('include', '/services/announces/30');
  });

  it('목록페이지에서 공지사항목록 추가 버튼을 누르면 공지사항 추가 페이지로 이동합니다.', () => {
    // when
    cy.contains('button', '공지사항목록 추가').click();
    // then
    cy.url().should('include', '/services/announces/create');
  });
});

describe('공지사항 추가 페이지', () => {
  beforeEach(() => {
    // given
    cy.login(Cypress.env('ADMIN_EMAIL'), Cypress.env('ADMIN_PASSWORD'));
    cy.visit(`${Cypress.env('TEST_BASE_URL')}/services/announces/create`);
  });

  it('추가페이지는 제목에 빈 값을 넣으면 "공지사항 제목을 입력해주세요" 토스트를 노출합니다.', () => {
    // when
    cy.get('[data-testid=input-title]').clear();
    cy.contains('button', '공지사항 추가').click();

    // then
    cy.contains('.ant-message-notice-content', '공지사항 제목을 입력해주세요');
  });

  it('추가페이지는 내용에 빈 값을 넣으면 "공지사항 내용을 입력해주세요" 토스트를 노출합니다.', () => {
    // when
    cy.get('[data-testid=input-title]').type('테스트 공지사항 제목');
    cy.get('[data-testid=input-content]').clear();
    cy.contains('button', '공지사항 추가').click();
    // then
    cy.contains('.ant-message-notice-content', '공지사항 내용을 입력해주세요');
  });

  it('추가페이지에서 제목과 내용을 입력 후 공지사항 추가 버튼을 누르면 "반영되었습니다."내용의 토스트가 노출되고 목록으로 이동합니다.', () => {
    // given
    cy.intercept({
      method: 'POST',
      url: `${Cypress.env('VITE_API_BASE_URL')}/api/v1/admin/announce`,
    }).as('/announce/create');
    cy.intercept(
      {
        method: 'GET',
        url: `${Cypress.env('VITE_API_BASE_URL')}/api/v1/admin/announce?page=1&size=10`,
      },
      { fixture: '/AnnouncePage/announce_page_1.json' },
    ).as('/announce?page=1&size=10');

    // when
    cy.get('[data-testid=input-title]').type('테스트 공지사항 제목 30');
    cy.get('[data-testid=input-content]').type('테스트 공지사항 내용 30');
    cy.contains('button', '공지사항 추가').click();

    // then
    cy.wait('@/announce/create');
    cy.contains('.ant-message-notice-content', '반영되었습니다.');
    cy.wait('@/announce?page=1&size=10');
    cy.url().should('eq', `${Cypress.env('TEST_BASE_URL')}/services/announces`);
    cy.get('.ant-table-tbody tr').should('contain', '테스트 공지사항 제목 30');
  });
});

describe('공지사항 상세 페이지', () => {
  beforeEach(() => {
    // given
    cy.login(Cypress.env('ADMIN_EMAIL'), Cypress.env('ADMIN_PASSWORD'));
    cy.intercept(
      {
        method: 'GET',
        url: `${Cypress.env('VITE_API_BASE_URL')}/api/v1/admin/announce/30`,
      },
      { fixture: '/AnnouncePage/announce.json' },
    ).as('/announce');
    cy.visit(`${Cypress.env('TEST_BASE_URL')}/services/announces/30`);
  });

  it('상세페이지에서 제목에 빈 값을 넣으면 "공지사항 제목을 입력해주세요" 토스트를 노출합니다.', () => {
    // when
    cy.get('[data-testid=input-title]').clear();
    cy.contains('button', '공지사항 수정').click();
    cy.on('window:confirm', () => false);

    // then
    cy.contains('.ant-message-notice-content', '공지사항 제목을 입력해주세요');
  });

  it('상세페이지에서 내용에 빈 값을 넣으면 "공지사항 내용을 입력해주세요" 토스트를 노출합니다.', () => {
    // when
    cy.get('[data-testid=input-content]').clear();
    cy.contains('button', '공지사항 수정').click();
    cy.on('window:confirm', () => false);

    // then
    cy.contains('.ant-message-notice-content', '공지사항 내용을 입력해주세요');
  });

  it('상세페이지에서 공지사항 수정 버튼을 누르면 "공지사항 목록으로 이동하시겠습니까?" 내용을 팝업이 노출되고 확인을 누르면 저장 후 목록으로 이동합니다.', () => {
    // given
    cy.intercept(
      'PUT',
      `${Cypress.env('VITE_API_BASE_URL')}/api/v1/admin/announce`,
      {
        statusCode: 200,
      },
    ).as('/announce/update');

    cy.intercept(
      {
        method: 'GET',
        url: `${Cypress.env('VITE_API_BASE_URL')}/api/v1/admin/announce?page=1&size=10`,
      },
      { fixture: '/AnnouncePage/announce_page_1_update.json' },
    ).as('/announce/update?page=1&size=10');

    // when
    cy.get('[data-testid=input-title]').clear();
    cy.get('[data-testid=input-title]').type('테스트 공지사항 제목 30 수정');
    cy.get('[data-testid=input-content]').clear();
    cy.get('[data-testid=input-content]').type('테스트 공지사항 내용 30 수정');
    cy.contains('button', '공지사항 수정').click();
    cy.wait('@/announce/update');
    cy.on('window:confirm', () => true);

    // then
    cy.wait('@/announce/update?page=1&size=10');
    cy.url().should('eq', `${Cypress.env('TEST_BASE_URL')}/services/announces`);
    cy.contains('.ant-message-notice-content', '반영되었습니다.');
    cy.get('.ant-table-tbody tr').should(
      'contain',
      '테스트 공지사항 제목 30 수정',
    );
  });

  it('상세페이지에서 공지사항 삭제 버튼을 누르면 "공지사항을 삭제하시겠습니까?" 내용의 팝업이 노출되고 확인을 누르면 "반영되었습니다." 토스트 노출 후 목록으로 이동합니다.', () => {
    // given
    cy.intercept(
      'DELETE',
      `${Cypress.env('VITE_API_BASE_URL')}/api/v1/admin/announce`,
      {
        statusCode: 200,
      },
    ).as('/announce/delete');

    cy.intercept(
      {
        method: 'GET',
        url: `${Cypress.env('VITE_API_BASE_URL')}/api/v1/admin/announce?page=1&size=10`,
      },
      { fixture: '/AnnouncePage/announce_page_1_delete.json' },
    ).as('/announce/delete?page=1&size=10');

    // when
    cy.contains('button', '공지사항 삭제').click();
    cy.wait('@/announce/delete');
    cy.on('window:confirm', () => true);

    // then
    cy.wait('@/announce/delete?page=1&size=10');
    cy.url().should('eq', `${Cypress.env('TEST_BASE_URL')}/services/announces`);
    cy.contains('.ant-message-notice-content', '반영되었습니다.');
    cy.get('.ant-table-tbody tr').should(
      'not.contain',
      '테스트 공지사항 제목 30',
    );
  });
});
