import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import IsLandorStatus from '../IsLandorStatus';
import axiosJWT from '../../../config/axiosJWT';

jest.mock('../../../config/axiosJWT');

describe('IsLandorStatus', () => {
  it('shows active state when API returns active package', async () => {
    const future = new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString();
    axiosJWT.get.mockResolvedValueOnce({ data: { success: true, isActive: true, expiresAt: future } });

    render(<IsLandorStatus />);

    await waitFor(() => expect(screen.getByText(/Gói đang hoạt động/i)).toBeInTheDocument());
    expect(screen.getByText(/Hạn sử dụng:/i)).toBeInTheDocument();
  });

  it('shows prompt when not active', async () => {
    axiosJWT.get.mockResolvedValueOnce({ data: { success: true, isActive: false } });
    render(<IsLandorStatus />);
    await waitFor(() => expect(screen.getByText(/Bạn hiện chưa có gói dịch vụ/i)).toBeInTheDocument());
  });
});
