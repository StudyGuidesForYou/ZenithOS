const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';

import OSProvider from '@/components/zenith/os/OSProvider';
import Shell from '@/components/zenith/os/Shell';
import Onboarding from '@/components/zenith/Onboarding';

function FullScreenSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-950">
      <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );
}

/* Entry point for the authenticated desktop. Before booting the OS we confirm
   the signed-in user has completed onboarding (a Profile record). New accounts
   — whether from email+OTP or Google — land on the username/user-ID setup. */
export default function ZenithOS() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!user) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const { items } = await db.entities.Profile.filter({ user_id: user.id }, { limit: 1 });
        if (active) setProfile(items[0] || null);
      } catch {
        if (active) setProfile(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [user]);

  if (loading || !user) return <FullScreenSpinner />;
  if (!profile) return <Onboarding user={user} onDone={setProfile} />;

  return (
    <OSProvider profile={profile}>
      <Shell />
    </OSProvider>
  );
}