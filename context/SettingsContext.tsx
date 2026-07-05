import { createContext, PropsWithChildren, useMemo, useState } from 'react';

interface SettingsState {
  notificationsEnabled: boolean;
  downloadOverWifiOnly: boolean;
  setNotificationsEnabled: (value: boolean) => void;
  setDownloadOverWifiOnly: (value: boolean) => void;
}

export const SettingsContext = createContext<SettingsState | null>(null);

export const SettingsProvider = ({ children }: PropsWithChildren) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [downloadOverWifiOnly, setDownloadOverWifiOnly] = useState(true);

  const value = useMemo(
    () => ({ notificationsEnabled, downloadOverWifiOnly, setNotificationsEnabled, setDownloadOverWifiOnly }),
    [downloadOverWifiOnly, notificationsEnabled],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};
