"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { 
  doc, 
  setDoc, 
  onSnapshot, 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";
import DeviceLimitModal from "@/components/dashboard/DeviceLimitModal";

interface SessionContextType {
  deviceId: string | null;
}

const SessionContext = createContext<SessionContextType>({ deviceId: null });

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [limitSessions, setLimitSessions] = useState<any[]>([]);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  // Function to actually register the session and attach listener
  const registerSession = async (user: User, currentDeviceId: string) => {
    try {
      let ipInfo = { ip: "Unknown", city: "Unknown", country: "Unknown" };
      try {
        const cachedIp = sessionStorage.getItem("bluebird_ip_info");
        if (cachedIp) {
          ipInfo = JSON.parse(cachedIp);
        } else {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          const res = await fetch("https://ipapi.co/json/", { 
            signal: controller.signal 
          }).catch(e => {
            console.warn("IP fetch failed:", e.message);
            return null;
          });
          
          clearTimeout(timeoutId);
          
          if (res && res.ok) {
            const data = await res.json();
            ipInfo = {
              ip: data.ip || "Unknown",
              city: data.city || "Unknown",
              country: data.country_name || "Unknown",
            };
            sessionStorage.setItem("bluebird_ip_info", JSON.stringify(ipInfo));
          }
        }
      } catch (err) {
        console.error("IP parsing error:", err);
      }

      const ua = navigator.userAgent;
      let browser = "Unknown Browser";
      let os = "Unknown OS";

      if (ua.includes("Firefox")) browser = "Firefox";
      else if (ua.includes("SamsungBrowser")) browser = "Samsung Internet";
      else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera";
      else if (ua.includes("Edge") || ua.includes("Edg")) browser = "Edge";
      else if (ua.includes("Chrome")) browser = "Chrome";
      else if (ua.includes("Safari")) browser = "Safari";

      if (ua.includes("Win")) os = "Windows";
      else if (ua.includes("Mac")) os = "macOS";
      else if (ua.includes("Linux")) os = "Linux";
      else if (ua.includes("Android")) os = "Android";
      else if (ua.includes("like Mac")) os = "iOS";

      const deviceName = `${os} - ${browser}`;
      const sessionRef = doc(db, "users", user.uid, "sessions", currentDeviceId);
      
      await setDoc(sessionRef, {
        deviceId: currentDeviceId,
        deviceName,
        userAgent: navigator.userAgent,
        ip: ipInfo.ip,
        location: `${ipInfo.city}, ${ipInfo.country}`,
        lastActive: serverTimestamp(),
        createdAt: serverTimestamp() 
      }, { merge: true });

      // After registering, ensure we don't have > 2 devices due to race conditions
      const sessionsQuery = query(collection(db, "users", user.uid, "sessions"), orderBy("lastActive", "desc"));
      const querySnapshot = await getDocs(sessionsQuery);
      if (querySnapshot.docs.length > 2) {
        for (let i = 2; i < querySnapshot.docs.length; i++) {
          const oldDoc = querySnapshot.docs[i];
          if (oldDoc.id !== currentDeviceId) {
            await deleteDoc(doc(db, "users", user.uid, "sessions", oldDoc.id));
          }
        }
      }

      // Return the unsubscribe function for the listener
      return onSnapshot(sessionRef, (docSnap) => {
        if (!docSnap.exists()) {
          signOut(auth).then(() => {
            window.location.href = "/login";
          });
        }
      }, (err) => {
        console.error("SessionContext snapshot error:", err);
      });

    } catch (err) {
      console.error("Error setting up session:", err);
      return null;
    }
  };

  useEffect(() => {
    let currentDeviceId = localStorage.getItem("bb_device_id");
    if (!currentDeviceId) {
      currentDeviceId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem("bb_device_id", currentDeviceId);
    }
    setDeviceId(currentDeviceId);

    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user && currentDeviceId) {
        
        // 1. Fetch current active sessions BEFORE registering
        const sessionsQuery = query(
          collection(db, "users", user.uid, "sessions"),
          orderBy("lastActive", "desc")
        );
        
        try {
          const querySnapshot = await getDocs(sessionsQuery);
          
          let isExistingDevice = false;
          querySnapshot.forEach((docSnap) => {
            if (docSnap.id === currentDeviceId) isExistingDevice = true;
          });

          if (!isExistingDevice && querySnapshot.docs.length >= 2) {
            // New device and limit reached! Trigger modal.
            const activeSessions = querySnapshot.docs.map(docSnap => ({
              id: docSnap.id,
              ...docSnap.data()
            }));
            
            setPendingUser(user);
            setLimitSessions(activeSessions);
            setShowLimitModal(true);
            return; // STOP here. Do not register yet.
          }

          // Limit not reached, or existing device: Proceed to register
          const unsub = await registerSession(user, currentDeviceId);
          if (unsub) unsubscribeSnapshot = unsub;

        } catch (error) {
          console.error("Error fetching sessions:", error);
        }

      } else {
        // User logged out
        setShowLimitModal(false);
        setPendingUser(null);
        if (unsubscribeSnapshot) {
          unsubscribeSnapshot();
          unsubscribeSnapshot = null;
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  const handleRevokeSession = async (sessionId: string) => {
    if (!pendingUser || !deviceId) return;
    try {
      // 1. Delete the chosen old session
      await deleteDoc(doc(db, "users", pendingUser.uid, "sessions", sessionId));
      
      // 2. Hide modal
      setShowLimitModal(false);
      
      // 3. Register current session
      await registerSession(pendingUser, deviceId);
      
    } catch (error) {
      console.error("Error revoking session:", error);
    }
  };

  const handleCancelAndSignOut = async () => {
    setShowLimitModal(false);
    await signOut(auth);
    window.location.href = "/login";
  };

  return (
    <SessionContext.Provider value={{ deviceId }}>
      {children}
      {showLimitModal && (
        <DeviceLimitModal 
          sessions={limitSessions} 
          onRevoke={handleRevokeSession} 
          onCancel={handleCancelAndSignOut} 
        />
      )}
    </SessionContext.Provider>
  );
};
