import { UserProvider } from './context/UserContext';
import AppRouter from './AppRouter';

function App() {
  return (
    // By wrapping the router here, all routes get access to the user context
    <UserProvider>
      <AppRouter />
    </UserProvider>
  );
}

export default App;