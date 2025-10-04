import {describe, expect, it} from 'vitest';

import {getFormView, listFormViews} from '@lib/forms';

describe('forms library', () => {
  it('returns a form view for the requested tenant and locale', () => {
    const form = getFormView({tenantId: 'tenant-main', key: 'contact', locale: 'vi'});

    expect(form).not.toBeNull();
    expect(form?.title).toBe('Gửi thông tin liên hệ');
    expect(form?.honeypotField).toBe('website');
  });

  it('returns null when the form does not exist for the tenant', () => {
    const form = getFormView({tenantId: 'tenant-main', key: 'non-existent', locale: 'vi'});

    expect(form).toBeNull();
  });

  it('lists all forms available for a tenant using the requested locale', () => {
    const views = listFormViews({tenantId: 'tenant-classic', locale: 'en'});

    expect(views).toHaveLength(1);
    expect(views[0]).toMatchObject({
      key: 'contact',
      tenantId: 'tenant-classic',
      title: 'Contact the academy'
    });
  });
});
