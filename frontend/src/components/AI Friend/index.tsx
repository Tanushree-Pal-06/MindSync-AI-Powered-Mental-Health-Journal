import AIFriendButton from './AIFriendButton';
import AIFriendChat from './AIFriendChat';
import { AIFriendProvider, useAIFriend } from './AIFriendContext';
const AIFriend = () => (
  <>
    <AIFriendButton />
    <AIFriendChat />
  </>
);
export { AIFriend, AIFriendProvider, useAIFriend };
export default AIFriend;