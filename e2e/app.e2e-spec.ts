import { ActivityPage } from './app.po';

describe('activity App', function() {
  let page: ActivityPage;

  beforeEach(() => {
    page = new ActivityPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
