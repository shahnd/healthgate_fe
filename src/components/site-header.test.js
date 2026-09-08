import { describe, expect, it } from 'vitest';
import { getBreadcrumbItems, getParentPath } from './site-header';

describe('breadcrumb mapping', () => {
  it('maps employee detail and edit flows', () => {
    expect(getBreadcrumbItems('/employees/123')).toEqual(['직원', '직원 상세']);
    expect(getBreadcrumbItems('/employees/123/edit')).toEqual(['직원', '직원 수정']);
  });

  it('maps hospital and notice detail flows', () => {
    expect(getBreadcrumbItems('/hospitals/12')).toEqual(['제휴 병원', '병원 상세']);
    expect(getBreadcrumbItems('/hospitals/12/edit')).toEqual(['제휴 병원', '병원 수정']);
    expect(getBreadcrumbItems('/notices/12')).toEqual(['공지사항', '공지사항 상세']);
    expect(getBreadcrumbItems('/notices/12/edit')).toEqual(['공지사항', '공지사항 수정']);
  });

  it('returns the right parent path for nested pages', () => {
    expect(getParentPath('/employees/123/edit')).toBe('/employees');
    expect(getParentPath('/hospitals/12/edit')).toBe('/hospitals/list');
    expect(getParentPath('/consultation/reservation/detail/7')).toBe('/consultation/reservation/list');
    expect(getParentPath('/checkup/reminders/history')).toBe('/checkup/targets');
    expect(getParentPath('/notices/new')).toBe('/notices/list');
  });

  it('maps safety document detail flow', () => {
    // given
    const pathname = '/safety-documents/10';

    // when
    const items = getBreadcrumbItems(pathname);
    const parentPath = getParentPath(pathname);

    // then
    expect(items).toEqual(['안전문서', '안전문서 상세']);
    expect(parentPath).toBe('/safety-documents');
  });
});
