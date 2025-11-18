import React, { createContext, useContext, useEffect, useState } from "react";
import {
  donorLogout,
  donorSignIn,
  donorSignUp,
  getToken,
  getCurrentDonor,
} from "../services/donorAuth.service";
import type { Donor, DonorAuthDto, DonorSignupDto } from "../types/donor";

interface DonorAuthContextType {
  donor: Donor | null;
  loading: boolean;
  signIn: (dto: DonorAuthDto) => Promise<void>;
  signUp: (dto: DonorSignupDto) => Promise<void>;
  logout: () => Promise<void>;
}

const DonorAuthContext = createContext<DonorAuthContextType>({
  donor: null,
  loading: false,
  signIn: async () => {},
  signUp: async () => {},
  logout: async () => {},
});

export const DonorAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [donor, setDonor] = useState<Donor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // check token on app start
    (async () => {
      const token = await getToken();
      if (token) {
        const me = await getCurrentDonor();
        if (me) setDonor(me);
      }
      setLoading(false);
    })();
  }, []);

  const signIn = async (dto: DonorAuthDto) => {
    setLoading(true);
    try {
      const data = await donorSignIn(dto);
      if (data.donor) setDonor(data.donor);
      else {
        const me = await getCurrentDonor();
        if (me) setDonor(me);
      }
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (dto: DonorSignupDto) => {
    setLoading(true);
    try {
      const data = await donorSignUp(dto);
      if (data.donor) setDonor(data.donor);
      else {
        const me = await getCurrentDonor();
        if (me) setDonor(me);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await donorLogout();
    setDonor(null);
  };

  return (
    <DonorAuthContext.Provider
      value={{ donor, loading, signIn, signUp, logout }}
    >
      {children}
    </DonorAuthContext.Provider>
  );
};

export const useDonorAuth = () => useContext(DonorAuthContext);
