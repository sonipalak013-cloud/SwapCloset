'use client';
import React, { useState } from 'react';
import { ArrowLeftRight, MessageSquare, Check, X, ChevronRight, Clock } from 'lucide-react';
import { toast } from 'sonner';
import Badge from '@/components/ui/Badge';
import { SWAP_REQUESTS, SwapRequest } from './dashboardData';

const STATUS_VARIANT_MAP: Record<string, string> = {
  pending: 'pending',
  accepted: 'active',
  rejected: 'rejected',
  completed: 'completed',
  negotiating: 'negotiating',
};

export default function SwapRequestsFeed() {
  const [requests, setRequests] = useState<SwapRequest[]>(SWAP_REQUESTS);
  const [activeFilter, setActiveFilter] = useState<'all' | 'incoming' | 'outgoing'>('all');

  const filtered = requests.filter((r) => {
    if (activeFilter === 'all') return true;
    return r.type === activeFilter;
  });

  const handleAccept = (req: SwapRequest) => {
    // BACKEND INTEGRATION: PATCH /api/swap-requests/:id with { status: 'accepted' }
    setRequests((prev) =>
      prev.map((r) =>
        r.id === req.id ? { ...r, status: 'accepted', statusLabel: 'Accepted — confirm meetup' } : r
      )
    );
    toast.success(`Swap accepted with ${req.otherUserName}! Send them a message to arrange the exchange.`);
  };

  const handleDecline = (req: SwapRequest) => {
    // BACKEND INTEGRATION: PATCH /api/swap-requests/:id with { status: 'rejected' }
    setRequests((prev) =>
      prev.map((r) =>
        r.id === req.id ? { ...r, status: 'rejected', statusLabel: 'Declined' } : r
      )
    );
    toast.info(`Swap request from ${req.otherUserName} declined`);
  };

  const incomingPending = requests.filter((r) => r.type === 'incoming' && r.status === 'pending').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-600 text-foreground">Swap Requests</h3>
          {incomingPending > 0 && (
            <span className="bg-accent text-accent-foreground text-[10px] font-700 px-2 py-0.5 rounded-full tabular-nums">
              {incomingPending} pending
            </span>
          )}
        </div>
        <div className="flex bg-muted rounded-lg p-0.5">
          {(['all', 'incoming', 'outgoing'] as const).map((tab) => (
            <button
              key={`req-tab-${tab}`}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-500 transition-all duration-150 capitalize ${
                activeFilter === tab
                  ? 'bg-card text-foreground shadow-card'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-card rounded-2xl border border-border p-8 text-center">
            <ArrowLeftRight size={24} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No {activeFilter !== 'all' ? activeFilter : ''} swap requests yet</p>
          </div>
        )}

        {filtered.map((req) => (
          <div
            key={req.id}
            className={`bg-card rounded-2xl border p-4 transition-all duration-150 hover:shadow-card ${
              req.status === 'pending' && req.type === 'incoming' ?'border-warning/40 bg-warning/5' :'border-border'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-primary text-xs font-700">{req.otherUserAvatar}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-600 text-foreground">{req.otherUserName}</span>
                    <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full capitalize">
                      {req.type}
                    </span>
                    <Badge variant={STATUS_VARIANT_MAP[req.status]}>
                      {req.statusLabel}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground shrink-0">
                    <Clock size={11} />
                    <span className="text-[11px]">{req.sentDaysAgo}d ago</span>
                  </div>
                </div>

                {/* Swap items */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs bg-muted px-2.5 py-1 rounded-lg text-foreground font-500 truncate max-w-[160px]">
                    {req.type === 'incoming' ? req.theirItem : req.myItem}
                  </span>
                  <ArrowLeftRight size={12} className="text-muted-foreground shrink-0" />
                  <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-lg font-500 truncate max-w-[160px]">
                    {req.type === 'incoming' ? req.myItem : req.theirItem}
                  </span>
                  {/* Value comparison */}
                  <span className={`text-[11px] font-500 px-2 py-0.5 rounded-full tabular-nums ${
                    Math.abs(req.theirItemValue - req.myItemValue) > 25
                      ? 'bg-warning/15 text-warning' :'bg-positive/10 text-positive'
                  }`}>
                    ${req.theirItemValue} ↔ ${req.myItemValue}
                  </span>
                </div>

                {/* Last message */}
                <p className="text-xs text-muted-foreground line-clamp-1 mb-3">
                  &ldquo;{req.lastMessage}&rdquo;
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 text-xs font-500 text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted">
                    <MessageSquare size={13} />
                    Message
                  </button>
                  {req.status === 'pending' && req.type === 'incoming' && (
                    <>
                      <button
                        onClick={() => handleDecline(req)}
                        className="flex items-center gap-1.5 text-xs font-500 text-negative px-3 py-1.5 rounded-lg bg-negative/10 hover:bg-negative/20 transition-colors"
                      >
                        <X size={13} />
                        Decline
                      </button>
                      <button
                        onClick={() => handleAccept(req)}
                        className="flex items-center gap-1.5 text-xs font-600 btn-primary px-3 py-1.5 rounded-lg"
                      >
                        <Check size={13} />
                        Accept
                      </button>
                    </>
                  )}
                  {req.status === 'accepted' && (
                    <button className="flex items-center gap-1.5 text-xs font-600 text-info px-3 py-1.5 rounded-lg bg-info/10 hover:bg-info/20 transition-colors">
                      <ChevronRight size={13} />
                      Confirm Meetup
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}