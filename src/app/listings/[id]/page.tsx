import React from 'react';
import AppLayout from '@/components/AppLayout';
import ItemDetailClient from './components/ItemDetailClient';

export default function ItemDetailPage({ params }: { params: { id: string } }) {
  return (
    <AppLayout activePath="/listings">
      <ItemDetailClient listingId={params.id} />
    </AppLayout>
  );
}
