import { createContext, useContext, useState, ReactNode } from 'react';
type AIFriendContextType = {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
};
const AIFriendContext = createContext<AIFriendContextType | null>(null);
export const AIFriendProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <AIFriendContext.Provider value={{ open, setOpen, toggle: () => setOpen(!open) }}>
      {children}
    </AIFriendContext.Provider>
  );
};
export const useAIFriend = () => {
  const ctx = useContext(AIFriendContext);
  if (!ctx) throw new Error('useAIFriend must be used within AIFriendProvider');
  return ctx;
};